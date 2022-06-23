import { param } from 'express-validator';
import { bloggersService } from '../domain/bloggers-service';

export const paramBloggerIdValidator = param('bloggerId')
  .trim()
  .notEmpty()
  .isInt({ min: 1 })
  .withMessage('Value should be number');
