import { body } from 'express-validator';

const nameMaxLength = 15;

export const nameValidator = body('name')
  .exists()
  .trim()
  .notEmpty()
  .withMessage('Missing a required parametr')
  .isLength({ max: nameMaxLength })
  .withMessage(`Length should be less then ${nameMaxLength}`);
