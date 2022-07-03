import { param } from 'express-validator';

export const paramBloggerIDValidator = param('bloggerId')
  .exists()
  .withMessage('Value should be exists')
  .notEmpty()
  .withMessage('Value should be not empty')
  .isString()
  .withMessage('Value should be string');

export const paramPostIDValidator = param('postId')
  .exists()
  .withMessage('Value should be exists')
  .notEmpty()
  .withMessage('Value should be not empty')
  .isString()
  .withMessage('Value should be string');
