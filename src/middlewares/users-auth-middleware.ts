import { NextFunction, Request, Response } from 'express';
import { EmailAdapter } from '../adapters/email-adapter';
import { JWTService } from '../application/jwt-service';
import { UsersService } from '../domain/users-service';
import { UsersRepository } from '../repositories/users-db-repository';

export class UsersAuthMiddleware {
  jwtService: JWTService;
  usersService: UsersService;
  constructor() {
    const adapter = new EmailAdapter();
    const repo = new UsersRepository();
    this.jwtService = new JWTService();
    this.usersService = new UsersService(repo, adapter);
  }
  async usersAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      res.send(401);
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = await this.jwtService.getUserIdByToken(token);
    if (userId) {
      req.user = await this.usersService.getUserByIdForAuth(userId);
      next();
    } else {
      res.send(401);
    }
  }
}

export const usersAuthMiddleware = new UsersAuthMiddleware();

/*export const usersAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.send(401);
    return;
  }
  const token = req.headers.authorization.split(' ')[1];
  const userId = await jwtService.getUserIdByToken(token);
  if (userId) {
    req.user = await usersService.getUserByIdForAuth(userId);
    next();
  } else {
    res.send(401);
  }
};*/
