import { body } from 'express-validator';
import { ObjectId } from 'mongodb';
import { usersService } from '../domain/users-service';

export const userExistsValidator = body('login').custom(async (login) => {
  const user = await usersService.getUserByLogIn(login);
  if (user) {
    throw new Error('UserLogin exists');
  }
  return true;
});
