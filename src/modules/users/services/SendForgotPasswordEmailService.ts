import AppError from '@shared/errors/AppErros';
import { getCustomRepository } from 'typeorm';
import path from 'path';

import { UsersRepository } from '../typeorm/repositories/UsersRepository';
import { UserTokensRepository } from '../typeorm/repositories/UserTokensRepository';
import EtherealMail from '@config/mail/EtherealMail';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokenRepository = getCustomRepository(UserTokensRepository);

    const userExists = await usersRepository.findByEmail(email);

    if (!userExists) {
      throw new AppError('User does not exists.');
    }

    const { token } = await userTokenRepository.generateToken(userExists.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await EtherealMail.sendMail({
      to: {
        name: userExists.name,
        email: userExists.email,
      },
      subject: 'API VENDAS - Recuperação de senha.',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: userExists.name,
          link: `http://localhost:3000/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
