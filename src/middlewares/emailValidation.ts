import { body } from 'express-validator';

export const emailValidator = body('email')
  .exists()
  .trim()
  .withMessage('Missing a required parametr')
  .isString()
  .withMessage(`email should be string`)
  .isEmail()
  .withMessage('Invalid eamil addres');
