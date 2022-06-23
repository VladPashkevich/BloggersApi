import { body } from 'express-validator';
import { bloggersService } from '../domain/bloggers-service';

export const bodyBloggerIDValidator = body('bloggerId')
  .trim()
  .notEmpty()
  .isInt({ min: 1 })
  .withMessage('Value should be number')
  .custom(async (bloggerId) => {
    const blogger = await bloggersService.getBloggersById(+bloggerId);
    if (!blogger) {
      throw new Error('BloggerId does not exists');
    }
    return true;
  });
