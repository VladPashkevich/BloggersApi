import { Router, Request, Response } from 'express';
import { jwtService } from '../application/jwt-service';
import { authService } from '../domain/auth-service';
import { usersService } from '../domain/users-service';
import { emailExistsValidator } from '../middlewares/emailCheckMiddleware';
import { emailValidator } from '../middlewares/emailValidation';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { mistake429 } from '../middlewares/ipChekMiddleware';
import { isConfirmedValidator } from '../middlewares/isConfirmedMiddleware';
import { userExistsValidator } from '../middlewares/loginCheckMiddleware';
import { userLoginValidator } from '../middlewares/userLoginValidation';
import { userPasswordValidator } from '../middlewares/userPasswordValidation';

export const authRouter = Router({});

authRouter.post(
  '/registration',
  userLoginValidator,
  userPasswordValidator,
  emailValidator,
  mistake429,
  emailExistsValidator,
  userExistsValidator,
  inputValidationMiddleware,

  async (req: Request, res: Response) => {
    const user = await authService.createUser(req.body.login, req.body.email, req.body.password);
    if (user) {
      res.sendStatus(204);
    }
  },
);

authRouter.post(
  '/registration-confirmation',
  mistake429,
  isConfirmedValidator,
  async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.code);
    if (result) {
      res.sendStatus(204);
    }
  },
);

authRouter.post(
  '/registration-email-resending',
  mistake429,
  emailExistsValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const result = await authService.confirmEmailResending(req.body.email);
    if (result) {
      res.sendStatus(204);
    } else {
      res.status(400).send({
        errorsMessages: [
          {
            message: 'string',
            field: 'string',
          },
        ],
      });
    }
  },
);

authRouter.post('/login', async (req: Request, res: Response) => {
  const user = await usersService.getUserByLogIn(req.body.login);
  if (!user) return res.sendStatus(401);

  const areCredentialsCorrect = await usersService.checkCredentials(
    user,
    req.body.login,
    req.body.password,
  );
  if (areCredentialsCorrect) {
    const token = await jwtService.createJWT(user);
    res.status(200).send({ token: token });
  } else {
    res.sendStatus(401);
  }
});
