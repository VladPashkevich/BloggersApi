import { body } from 'express-validator';

export const bloggerIdValidator = body('bloggerId')
  .trim()
  .notEmpty()
  .isInt({ min: 1 })
  .withMessage('Value should be number');
