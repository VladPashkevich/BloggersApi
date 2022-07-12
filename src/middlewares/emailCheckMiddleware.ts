import { body } from 'express-validator';
import { ObjectId } from 'mongodb';
import { usersService } from '../domain/users-service';

export const emailExistsValidator = body('email').custom(async (email) => {
  const user = await usersService.findUserByEmail(email);
  if (user) {
    throw new Error('UserEmail exists');
  }
  return true;
});
