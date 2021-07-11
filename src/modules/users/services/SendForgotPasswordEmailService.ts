import AppError from '@shared/errors/AppErros';
import { getCustomRepository } from 'typeorm';

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

    // console.log(token);

    await EtherealMail.sendMail({
      to: email,
      body: `Solicitação de redefinição de senha recebida. Este é o seu token: ${token}`,
    });
  }
}

export default SendForgotPasswordEmailService;
