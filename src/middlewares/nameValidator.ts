import { body } from 'express-validator';

const nameMaxLength = 15;

export const nameValidator = body('name')
  .exists()
  .withMessage('Missing a required parametr')
  .trim()
  .notEmpty()
  .withMessage('Name must be not empty')
  .isLength({ max: nameMaxLength })
  .withMessage(`Length should be less then ${nameMaxLength}`);
