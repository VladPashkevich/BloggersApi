import { id } from 'date-fns/locale';
import { Router, Request, Response } from 'express';
import { jwtService } from '../application/jwt-service';
import { authService } from '../domain/auth-service';
import { usersService } from '../domain/users-service';
import { emailExistsValidator } from '../middlewares/emailCheckMiddleware';
import { emailFindValidator } from '../middlewares/emailExistValidation';
import { emailValidator } from '../middlewares/emailValidation';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { mistake429 } from '../middlewares/ipChekMiddleware';
import { isConfirmedEmailValidator } from '../middlewares/isConfirmedEmail';
import { isConfirmedValidator } from '../middlewares/isConfirmedMiddleware';
import { userExistsValidator } from '../middlewares/loginCheckMiddleware';
import { userLoginValidator } from '../middlewares/userLoginValidation';
import { userPasswordValidator } from '../middlewares/userPasswordValidation';
import { usersAuthMiddleware } from '../middlewares/users-auth-middleware';
import { tokenCollections, usersCollection } from '../repositories/db';

export const authRouter = Router({});

authRouter.post(
  '/registration',
  mistake429,
  userLoginValidator,
  userPasswordValidator,
  emailValidator,

  userExistsValidator,
  emailExistsValidator,
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
    const result = await authService.confirmCode(req.body.code);
    if (result) {
      res.sendStatus(204);
    } else {
      res.status(400).send({
        errorsMessages: [
          {
            message: 'user is confirmed',
            field: 'code',
          },
        ],
      });
    }
  },
);

authRouter.post(
  '/registration-email-resending',
  mistake429,
  isConfirmedEmailValidator,
  emailFindValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const result = await authService.confirmEmailResending(req.body.email);
    if (result) {
      res.status(204).send();
    } else {
      res.status(400).send({
        errorsMessages: [
          {
            message: 'string',
            field: 'code',
          },
        ],
      });
    }
  },
);
authRouter.post('/refresh-token', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const userId = await jwtService.getUserIdByToken(refreshToken);
  if (!userId) return null;

  const token = await tokenCollections.findOne({ token: refreshToken, userId });
  if (!token) return res.sendStatus(401);

  const checkUser = await usersService.getUserById(userId);
  if (checkUser) {
    const user = await usersCollection.findOne({ _id: userId });
    if (!user) return null;
    const token = await jwtService.createJWT(user);
    const refreshToken = await jwtService.createJWTRefresh(user);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000,
    });
    res.status(200).send({ accessToken: token });
  } else {
    res.sendStatus(401);
  }
});

authRouter.post('/logout', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const userId = await jwtService.getUserIdByToken(refreshToken);
  if (!userId) return null;
  const token = await tokenCollections.findOne({ token: refreshToken, userId });
  if (!token) return res.sendStatus(401);

  const checkUser = await usersService.getUserById(userId);
  if (!checkUser) return res.sendStatus(401);

  await tokenCollections.deleteOne({ token: refreshToken, userId });
  res.clearCookie('refreshToken');
  res.sendStatus(204);
});

authRouter.post('/me', usersAuthMiddleware, async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.split(' ')[1];

  if (accessToken) {
    const userId = await jwtService.getUserIdByToken(accessToken);
    if (!userId) return res.sendStatus(401);
    const checkUser = await usersService.getUserByIdToken(userId);
    if (checkUser) {
      res.status(200).send(checkUser);
    } else {
      res.sendStatus(401);
    }
  }
});

authRouter.post('/login', mistake429, async (req: Request, res: Response) => {
  const user = await usersService.getUserByLogIn(req.body.login);
  if (!user) return res.sendStatus(401);

  const areCredentialsCorrect = await usersService.checkCredentials(
    user,
    req.body.login,
    req.body.password,
  );
  if (areCredentialsCorrect) {
    const token = await jwtService.createJWT(user);
    const refreshToken = await jwtService.createJWTRefresh(user);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000,
    });
    res.status(200).send({ accessToken: token });
  } else {
    res.sendStatus(401);
  }
});
