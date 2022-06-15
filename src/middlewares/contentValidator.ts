import { body } from 'express-validator';

const contentMaxLength = 1000;

export const contentValidator = body('content')
  .trim()
  .withMessage('Missing a required parametr')
  .notEmpty()
  .isLength({ max: contentMaxLength })
  .withMessage(`Title shoud be less then ${contentMaxLength}`);
