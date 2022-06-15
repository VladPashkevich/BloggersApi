import { body } from 'express-validator';

export const bloggerIdValidator = body('bloggerId')
  .exists()
  .trim()
  .isInt({ min: 1 })
  .withMessage('Value should be number');
