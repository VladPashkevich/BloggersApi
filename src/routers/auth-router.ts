import { Router, Request, Response } from 'express';
import { jwtService } from '../application/jwt-service';
import { usersService } from '../domain/users-service';

export const authRouter = Router({});

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
    res.status(200).send(token);
  } else {
    res.sendStatus(401);
  }
});
