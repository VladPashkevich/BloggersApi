import { body } from 'express-validator';
import { ObjectId } from 'mongodb';
import { bloggersService } from '../domain/bloggers-service';

export const bodyBloggerIDValidator = body('bloggerId').custom(async (bloggerId) => {
  const blogger = await bloggersService.getBloggersById(new ObjectId(bloggerId));
  if (!blogger) {
    throw new Error('BloggerId does not exists');
  }
  return true;
});
