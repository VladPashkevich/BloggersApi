import { NextFunction, Request, Response } from 'express';

import { usersCollection } from '../repositories/db';

export const isConfirmedValidator = async (req: Request, res: Response, next: NextFunction) => {
  const code = req.body.code;
  let isConfirm = await usersCollection.findOne({
    'emailConfirmation.confirmationCode': code,
  });
  console.log(isConfirm);
  if (!isConfirm) {
    res.status(400).send({
      errorsMessages: [
        {
          message: 'string',
          field: 'code',
        },
      ],
    });
    return;
  }
  if (!isConfirm.emailConfirmation.confirmationCode) {
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
