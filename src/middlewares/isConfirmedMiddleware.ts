import { NextFunction, Request, Response } from 'express';

import { usersCollection } from '../repositories/db';

export const isConfirmedValidator = async (req: Request, res: Response, next: NextFunction) => {
  const isConfirmed = await usersCollection.findOne({ 'emailConfirmation.isConfirmed': true });
  if (isConfirmed) {
    res.status(400).send('user accses');
  } else {
    next();
  }
};
