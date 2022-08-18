import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { EmailAdapter } from '../adapters/email-adapter';
import { JWTService } from '../application/jwt-service';
import { UsersService } from '../domain/users-service';
import { UsersRepository } from '../repositories/users-db-repository';

class UsersIdMiddleware {
  jwtService: JWTService;
  usersService: UsersService;
  constructor() {
    const adapter = new EmailAdapter();
    const repo = new UsersRepository();
    this.jwtService = new JWTService();
    this.usersService = new UsersService(repo, adapter);
  }
  async usersIdMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = await this.jwtService.getUserIdByToken(token);
    if (userId) {
      req.user = await this.usersService.getUserByIdForAuth(userId);
      next();
      return;
    }
    next();
    return;
  }
}
const usersIdMiddleware = new UsersIdMiddleware();
export const userIdMiddleware = usersIdMiddleware.usersIdMiddleware.bind(usersIdMiddleware);
