import { body } from 'express-validator';

const passwordMaxLength = 30;
const passwordMinLength = 6;

export const contentValidator = body('login')
  .trim()

  .notEmpty()
  .withMessage('Missing a required parametr')
  .isLength({ min: passwordMinLength, max: passwordMaxLength })
  .withMessage(`Title shoud be between ${passwordMinLength} and ${passwordMaxLength}`);
