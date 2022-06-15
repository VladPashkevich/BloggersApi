import { param } from 'express-validator';

export const paramBloggerIDValidator = param('bloggerId')
  .exists()
  .withMessage('Value should be exists')
  .notEmpty()
  .withMessage('Value should be not empty')
  .isInt({ min: 1 })
  .withMessage('Value should be number');

export const paramPostIDValidator = param('postId')
  .exists()
  .withMessage('Value should be exists')
  .notEmpty()
  .withMessage('Value should be not empty')
  .isInt({ min: 1 })
  .withMessage('Value should be number');
