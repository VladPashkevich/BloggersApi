import { usersService } from '../domain/users-service';
import { Request, Response, Router } from 'express';
import { ObjectId } from 'mongodb';
import { superAdminAuthMiddleware } from '../middlewares/basicAutht';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { mongoIdValidator } from '../middlewares/idValidator';
import { userPasswordValidator } from '../middlewares/userPasswordValidation';
import { userLoginValidator } from '../middlewares/userLoginValidation';

export const usersRouter = Router({});

usersRouter.post(
  '/',
  superAdminAuthMiddleware,
  userPasswordValidator,
  userLoginValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const login: string = req.body.login;
    const password: string = req.body.password;
    const email: string = req.body.email;

    const newUser = await usersService.createdNewUser(login, email, password);
    if (newUser) {
      res.status(201).send({ id: newUser.id, login: newUser.accountData.login });
    }
  },
);

usersRouter.get('/', async (req: Request, res: Response) => {
  const pageNumber = Number(req.query.PageNumber) || 1;
  const pageSize = Number(req.query.PageSize) || 10;
  const allUsers = await usersService.getAllUsers(pageNumber, pageSize);
  res.status(200).send(allUsers);
});

usersRouter.delete(
  '/:userId',
  superAdminAuthMiddleware,
  mongoIdValidator('userId'),
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const userIsDelete = await usersService.deleteUserById(new ObjectId(req.params.userId));
    if (userIsDelete) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  },
);
