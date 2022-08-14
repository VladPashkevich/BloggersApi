import { NextFunction, Request, Response } from 'express';

import { UsersModel } from '../repositories/db';

export const isConfirmedValidator = async (req: Request, res: Response, next: NextFunction) => {
  const code = req.body.code;
  let isConfirm = await UsersModel.findOne({
    'emailConfirmation.confirmationCode': code,
  });
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
  next();
};
