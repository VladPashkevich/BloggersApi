import { Request, Response } from 'express';
import { JWTService } from '../application/jwt-service';
import { AuthService } from '../domain/auth-service';
import { UsersService } from '../domain/users-service';
import { injectable } from 'inversify';

@injectable()
export class AuthController {
  constructor(
    protected jwtService: JWTService,
    protected authService: AuthService,
    protected usersService: UsersService,
  ) {
    this.jwtService = jwtService;
    this.authService = authService;
    this.usersService = usersService;
  }

  async registrationUser(req: Request, res: Response) {
    const user = await this.authService.createUser(
      req.body.login,
      req.body.email,
      req.body.password,
    );
    if (user) {
      res.sendStatus(204);
    }
  }

  async registrationWithCode(req: Request, res: Response) {
    const result = await this.authService.confirmCode(req.body.code);
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
  }

  async resendingEmailWithCode(req: Request, res: Response) {
    const result = await this.authService.confirmEmailResending(req.body.email);
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
  }

  async logininzation(req: Request, res: Response) {
    const user = await this.usersService.getUserByLogIn(req.body.login);
    if (!user) return res.sendStatus(401);

    const areCredentialsCorrect = await this.usersService.checkCredentials(
      user,
      req.body.login,
      req.body.password,
    );
    if (areCredentialsCorrect) {
      const token = await this.jwtService.createJWT(user);
      const refreshToken = await this.jwtService.createJWTRefresh(user);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 20 * 1000,
      });
      res.status(200).send({ accessToken: token });
    } else {
      res.sendStatus(401);
    }
  }

  async createTwoToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const tokenExpire = await this.jwtService.getUserIdByToken(refreshToken);
    if (tokenExpire === null) return res.sendStatus(401);
    const findToken = await this.jwtService.refreshTokenFind(refreshToken);
    if (findToken === false) return res.sendStatus(401);
    await this.jwtService.refreshTokenKill(refreshToken);
    const userId = await this.jwtService.getUserIdByToken(refreshToken);
    if (!userId) return res.sendStatus(401);
    const user = await this.usersService.getUserByIdForAuth(userId);
    if (!user) {
      res.sendStatus(401);
      return;
    }
    const token = await this.jwtService.createJWT(user);
    const refreshtoken = await this.jwtService.createJWTRefresh(user);

    res.cookie('refreshToken', refreshtoken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000,
    });
    res.status(200).send({ accessToken: token });
  }

  async logoutFromSystem(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const tokenExpire = await this.jwtService.getUserIdByToken(refreshToken);
    if (tokenExpire === null) return res.sendStatus(401);
    const result = await this.jwtService.refreshTokenKill(refreshToken);
    if (result === true) {
      res.sendStatus(204);
      return;
    } else {
      res.sendStatus(401);
      return;
    }
  }

  async showUserAfterAuth(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ')[1];

    if (!accessToken) {
      res.sendStatus(401);
      return;
    } else {
      const userId = await this.jwtService.getUserIdByToken(accessToken);
      if (!userId) return res.sendStatus(401);
      const user = await this.usersService.getUserByIdToken(userId);
      if (user) {
        res.status(200).send(user);
      }
    }
  }
}
