import { NextFunction, Request, Response } from 'express';
import { validationResult, ValidationError } from 'express-validator';

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errorFormatter = ({ msg, param }: ValidationError) => {
    return { message: msg, field: param };
  };

  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorsMessages: errors.array() });
  } else {
    next();
  }
};
