import { body } from 'express-validator';

const nameMaxLength = 15;

export const nameValidator = body('name')
  .trim()
  .notEmpty()
  .withMessage('Name must be not empty')
  .isLength({ max: nameMaxLength })
  .withMessage(`Length should be less then ${nameMaxLength}`);
