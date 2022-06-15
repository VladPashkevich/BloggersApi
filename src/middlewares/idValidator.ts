import { param } from 'express-validator';

export const idValidator = param(['id', 'bloggerId', 'postId'])
  .exists()
  .withMessage('Value should be exists')
  .notEmpty()
  .withMessage('Value should be not empty')
  .isInt({ min: 1 })
  .withMessage('Value should be number');
