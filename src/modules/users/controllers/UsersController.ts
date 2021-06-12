import { Request, Response } from 'express';

import CreateUserService from '../services/CreateUserService';
import ListUserService from '../services/ListUserService';

export default class UsersController {
  /**
   * GET /users
   */
  public async list(request: Request, response: Response): Promise<Response> {
    const listUserService = new ListUserService();
    const users = await listUserService.execute();

    return response.json({ users, status: 200 });
  }
  /**
   * POST /users
   */
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({ name, email, password });

    return response.json({ user, status: 200 });
  }
}
