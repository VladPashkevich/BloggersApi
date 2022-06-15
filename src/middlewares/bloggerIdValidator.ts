import { body } from 'express-validator';
import { bloggers } from '../repositories/database';

export const bodyBloggerIDValidator = body('bloggerId')
  .trim()
  .notEmpty()
  .isInt({ min: 1, max: 2147483647 })
  .withMessage('Value should be number')
  .custom((bloggerId) => {
    const blogger = bloggers.find((blogger) => blogger.id == bloggerId);
    if (!blogger) {
      throw new Error('BloggerId does not exists');
    }
    return true;
  });
