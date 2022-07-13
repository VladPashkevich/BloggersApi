import { body } from 'express-validator';
import { ObjectId } from 'mongodb';
import { usersService } from '../domain/users-service';

export const emailFindValidator = body('email').custom(async (email) => {
  const user = await usersService.findUserByEmail(email);
  if (!user) {
    throw new Error('UserEmail doesnt exists');
  }
  return true;
});
