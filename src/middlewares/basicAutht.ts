import { NextFunction, Request, Response } from 'express';

export const superAdminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const base64 = Buffer.from('admin:qwerty').toString('base64');
  const encode = `Basic ${base64}`;
  if (authHeader === encode) {
    next();
  } else {
    // check Basic auth for login/pass pair: superadmin/12345
    res.send(401);
  }
};
