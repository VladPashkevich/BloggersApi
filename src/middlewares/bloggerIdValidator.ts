import { body } from 'express-validator';

export const bloggerIdValidator = body('bloggerId')
  .exists()
  .trim()
  .isInt({ min: -2147483647, max: 2147483647 })
  .withMessage('Value should be number');
