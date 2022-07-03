import { body } from 'express-validator';

const loginMaxLength = 10;
const loginMinLength = 3;

export const contentValidator = body('login')
  .trim()

  .notEmpty()
  .withMessage('Missing a required parametr')
  .isLength({ min: loginMinLength, max: loginMaxLength })
  .withMessage(`Title shoud be between ${loginMinLength} and ${loginMaxLength}`);
