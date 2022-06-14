import { param } from 'express-validator';

export const idValidator = param('id')
  .exists()
  .isInt({ min: 1 })
  .withMessage('Value should be number');
