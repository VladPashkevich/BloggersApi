import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../application/jwt-service';
import { usersService } from '../domain/users-service';

export const usersAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.send(401);
    return;
  }
  const token = req.headers.authorization.split('')[1];

  const userId = await jwtService.getUserIdByToken(token);
  if (userId) {
    req.user = await usersService.getUserByIdForAuth(userId);
    next();
  } else {
    res.send(401);
  }
};
