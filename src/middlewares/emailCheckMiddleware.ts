import { body } from 'express-validator';
import { ObjectId } from 'mongodb';
import { EmailAdapter } from '../adapters/email-adapter';
import { UsersService } from '../domain/users-service';
import { UsersRepository } from '../repositories/users-db-repository';

export class EmailExistsValidator {
  usersService: UsersService;
  constructor() {
    const adapter = new EmailAdapter();
    const repo = new UsersRepository();
    this.usersService = new UsersService(repo, adapter);
  }
  checkExistEmail() {
    const instance = new EmailExistsValidator();
    return body('email').custom(async (email) => {
      const user = await instance.usersService.findUserByEmail(email);
      if (user) {
        throw new Error('UserEmail exists');
      }
      return true;
    });
  }
}

export const checkExistEmail = new EmailExistsValidator();

//export const checkExistEmail = new EmailExistsValidator(UsersRepository, EmailAdapter);

/*return body('email').custom(async (email) => {
  const user = await this.usersService.findUserByEmail(email);
  if (user) {
    throw new Error('UserEmail exists');
  }
  return true;
});*/
