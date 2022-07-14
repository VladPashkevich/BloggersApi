import { NextFunction, Request, Response } from 'express';

import { usersCollection } from '../repositories/db';

export const isConfirmedEmailValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const code = req.body.code;
  let isConfirm = await usersCollection.findOne({
    'emailConfirmation.confirmationCode': code,
  });
  if (isConfirm && isConfirm.emailConfirmation.isConfirmed) {
    res.status(400).send({
      errorsMessages: [
        {
          message: 'user is confirmed',
          field: 'code',
        },
      ],
    });
    return;
  }
  next();
};
