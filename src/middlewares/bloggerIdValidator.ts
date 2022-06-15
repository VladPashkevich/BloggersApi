import { body } from 'express-validator';

export const bloggerIdValidator = body('bloggerId')
  .trim()
  .notEmpty()
  .isInt({ min: 1, max: 2147483647 })
  .withMessage('Value should be number');
