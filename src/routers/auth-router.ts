import { id } from 'date-fns/locale';
import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth-controller';

import { checkNoExistEmail } from '../middlewares/emailExistValidation';
import { emailValidator } from '../middlewares/emailValidation';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { mistakes429 } from '../middlewares/ipChekMiddleware';
import { isConfirmedEmailValidator } from '../middlewares/isConfirmedEmail';
import { isConfirmedValidator } from '../middlewares/isConfirmedMiddleware';
import { loginFindValidator, LoginFindValidator } from '../middlewares/loginCheckMiddleware';
import { userLoginValidator } from '../middlewares/userLoginValidation';
import { userPasswordValidator } from '../middlewares/userPasswordValidation';
import { usersAuthMiddleware } from '../middlewares/users-auth-middleware';
import { container } from '../root/composition-root';

export const authRouter = Router({});

const authController = container.resolve(AuthController);

/*authRouter.post(
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
);*/

authRouter.post(
  '/registration',
  mistakes429.mistake429,
  userLoginValidator,
  userPasswordValidator,
  emailValidator,
  loginFindValidator.checkLogin,
  checkNoExistEmail.checkNoExistEmail,
  inputValidationMiddleware,
  authController.registrationUser.bind(authController),
);

/*authRouter.post(
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
);*/

authRouter.post(
  '/registration-confirmation',
  mistakes429.mistake429,
  isConfirmedValidator,
  authController.registrationWithCode.bind(authController),
);

/*authRouter.post(
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
);*/

authRouter.post(
  '/registration-email-resending',
  mistakes429.mistake429,
  isConfirmedEmailValidator,
  checkNoExistEmail.checkNoExistEmail,
  inputValidationMiddleware,
  authController.resendingEmailWithCode.bind(authController),
);

/*authRouter.post('/refresh-token', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  const tokenExpire = await jwtService.getUserIdByToken(refreshToken);
  if (tokenExpire === null) return res.sendStatus(401);
  const findToken = await jwtService.refreshTokenFind(refreshToken);
  if (findToken === false) return res.sendStatus(401);
  await jwtService.refreshTokenKill(refreshToken);
  const userId = await jwtService.getUserIdByToken(refreshToken);
  if (!userId) return res.sendStatus(401);
  const user = await usersService.getUserByIdForAuth(userId);
  if (!user) {
    res.sendStatus(401);
    return;
  }
  const token = await jwtService.createJWT(user);
  const refreshtoken = await jwtService.createJWTRefresh(user);

  res.cookie('refreshToken', refreshtoken, {
    httpOnly: true,
    secure: true,
    maxAge: 20 * 1000,
  });
  res.status(200).send({ accessToken: token });
});*/

authRouter.post('/refresh-token', authController.createTwoToken.bind(authController));

/*authRouter.post('/logout', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  const tokenExpire = await jwtService.getUserIdByToken(refreshToken);
  if (tokenExpire === null) return res.sendStatus(401);
  const result = await jwtService.refreshTokenKill(refreshToken);
  if (result === true) {
    res.sendStatus(204);
    return;
  } else {
    res.sendStatus(401);
    return;
  }
});*/

/*authRouter.post('/logout', authController.logoutFromSystem);

authRouter.get('/me', usersAuthMiddleware, async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.split(' ')[1];

  if (!accessToken) {
    res.sendStatus(401);
    return;
  } else {
    const userId = await jwtService.getUserIdByToken(accessToken);
    if (!userId) return res.sendStatus(401);
    const user = await usersService.getUserByIdToken(userId);
    if (user) {
      res.status(200).send(user);
    }
  }
});*/

authRouter.get(
  '/me',
  usersAuthMiddleware.usersAuthMiddleware,
  authController.showUserAfterAuth.bind(authController),
);

/*authRouter.post('/login', mistake429, async (req: Request, res: Response) => {
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
});*/

authRouter.post(
  '/login',
  mistakes429.mistake429,
  authController.logininzation.bind(authController),
);
