import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/Users';
import AppError from '../errors/AppError';

// quando não temos uma query personalizada para uma entidade, não precisa criar repository,
// é só pegar o repo do getRepository do typeorm

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExist = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExist) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);
    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;