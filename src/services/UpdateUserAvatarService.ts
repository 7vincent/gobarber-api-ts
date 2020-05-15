import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/Users';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUsersAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated user can change avatar', 401);
    }
    if (user.avatar) {
      // deletar avatar
      const userAvatarFilePath = path.join(uploadConfig.diretory, user.avatar);
      const userAvatarExists = await fs.promises.stat(userAvatarFilePath);
      if (userAvatarExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    user.avatar = avatarFilename;
    await usersRepository.save(user);
    return user;
  }
}

export default UpdateUsersAvatarService;
