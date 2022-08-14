import { body } from 'express-validator';
import { EmailAdapter } from '../adapters/email-adapter';
import { UsersService } from '../domain/users-service';
import { UsersRepository } from '../repositories/users-db-repository';

export class EmailFindValidator {
  usersService: UsersService;
  constructor() {
    const adapter = new EmailAdapter();
    const repo = new UsersRepository();
    this.usersService = new UsersService(repo, adapter);
  }

  checkNoExistEmail() {
    const instance = new EmailFindValidator();
    return body('email').custom(async (email) => {
      const user = await instance.usersService.findUserByEmail(email);
      if (user) {
        throw new Error('UserEmail doesnt exists');
      }
      return true;
    });
  }
}
export const checkNoExistEmail = new EmailFindValidator();

/*export const emailFindValidator = body('email').custom(async (email) => {
  const user = await usersService.findUserByEmail(email);
  if (!user) {
    throw new Error('UserEmail doesnt exists');
  }
  return true;
});*/
