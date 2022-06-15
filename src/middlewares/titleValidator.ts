import { body } from 'express-validator';

const titleMaxLength = 30;

export const titleValidator = body('title')
  .trim()
  .notEmpty()
  .withMessage('Missing a required parametr')
  .isLength({ max: titleMaxLength })
  .withMessage(`Title shoud be less then ${titleMaxLength}`);
