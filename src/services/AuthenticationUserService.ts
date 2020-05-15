import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/Users';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface Request {
  email: string;
  password: string;
}

class AuthenticationUserService {
  public async execute({
    email,
    password,
  }: Request): Promise<{ user: User; token: string }> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Incorreto Senha/Email.', 401);
    }

    const checkPassword = await compare(password, user.password);
    if (!checkPassword) {
      throw new AppError('Incorreto Senha/Email.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    // 1º parametro é o payload (não seguro qualquer um pode descriptografar)
    // 2º um hash unico, pode ser gerado um md5
    // 3º subject: colocamos o id do user, para depois idintificar
    // 4º tempo de expiração do token
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });
    return { user, token };
  }
}

export default AuthenticationUserService;
