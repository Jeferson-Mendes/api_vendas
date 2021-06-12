import { Request, Response } from 'express';

import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

export default class UserAvatarController {
  /**
   * POST /users
   */
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { filename } = request.file;

    const upadteAvatarService = new UpdateUserAvatarService();

    const user = upadteAvatarService.execute({
      user_id: id,
      avatarFilename: filename,
    });

    return response.json({ user, status: 200 });
  }
}
