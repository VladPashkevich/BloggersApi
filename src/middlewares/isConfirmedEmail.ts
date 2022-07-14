import { NextFunction, Request, Response } from 'express';

import { usersCollection } from '../repositories/db';

export const isConfirmedEmailValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const email = req.body.email;
  let isConfirm = await usersCollection.findOne({
    'accountData.email': email,
  });
  if (isConfirm && isConfirm.emailConfirmation.isConfirmed) {
    res.status(400).send({
      errorsMessages: [
        {
          message: 'email is confirmed',
          field: 'email',
        },
      ],
    });
    return;
  }
  next();
};
