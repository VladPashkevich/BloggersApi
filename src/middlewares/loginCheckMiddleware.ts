import { body } from 'express-validator';
import { ObjectId } from 'mongodb';
import { EmailAdapter } from '../adapters/email-adapter';
import { UsersService } from '../domain/users-service';
import { UsersRepository } from '../repositories/users-db-repository';

export class LoginFindValidator {
  usersService: UsersService;
  constructor() {
    const adapter = new EmailAdapter();
    const repo = new UsersRepository();
    this.usersService = new UsersService(repo, adapter);
  }
  checkLogin() {
    const instance = new LoginFindValidator();
    return body('login').custom(async (login) => {
      const user = await instance.usersService.getUserByLogIn(login);
      if (user) {
        throw new Error('Userlogin exists');
      }
      return true;
    });
  }
}

export const loginFindValidator = new LoginFindValidator();

/*const user = await usersService.getUserByLogIn(login);
  console.log(user);
  if (user) {
    throw new Error('UserLogin exists');
  }
  return true;
});*/
