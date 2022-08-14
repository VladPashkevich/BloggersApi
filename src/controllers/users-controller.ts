import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { UsersService } from '../domain/users-service';

@injectable()
export class UsersController {
  constructor(protected usersService: UsersService) {
    this.usersService = usersService;
  }

  async createUser(req: Request, res: Response) {
    const login: string = req.body.login;
    const password: string = req.body.password;
    const email: string = req.body.email;

    const newUser = await this.usersService.createdNewUser(login, email, password);
    if (newUser) {
      res.status(201).send({ id: newUser.id, login: newUser.accountData.login });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    const pageNumber = Number(req.query.PageNumber) || 1;
    const pageSize = Number(req.query.PageSize) || 10;
    const allUsers = await this.usersService.getAllUsers(pageNumber, pageSize);
    res.status(200).send(allUsers);
  }

  async deleteUser(req: Request, res: Response) {
    const userIsDelete = await this.usersService.deleteUserById(new ObjectId(req.params.userId));
    if (userIsDelete) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
}
