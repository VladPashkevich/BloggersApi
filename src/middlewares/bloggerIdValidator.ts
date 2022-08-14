import { body } from 'express-validator';
import { ObjectId } from 'mongodb';
import { BloggersService } from '../domain/bloggers-service';
import { LikeHelperClass } from '../domain/helperclass/like-helperclass';
import { PostsHelper } from '../domain/helperclass/post-helperclass';
import { BloggersRepository } from '../repositories/bloggers-db-repository';
import { LikesRepository } from '../repositories/likes-repository';
import { PostsRepository } from '../repositories/posts-db-repository';
import { injectable } from 'inversify';

@injectable()
export class BodyBloggerIDValidator {
  bloggersService: BloggersService;

  constructor() {
    const postrepo = new PostsRepository();
    const repo = new BloggersRepository();
    const like = new LikesRepository();
    const likeHelper = new LikeHelperClass(like);
    const postHelperClass = new PostsHelper(repo, postrepo, likeHelper);

    this.bloggersService = new BloggersService(repo, postrepo, postHelperClass);
  }

  new() {
    const instance = new BodyBloggerIDValidator();
    return body('bloggerId').custom(async (bloggerId) => {
      const blogger = await instance.bloggersService.getBloggersById(new ObjectId(bloggerId));

      if (!blogger) {
        throw new Error('BloggerId does not exists');
      }
      return true;
    });
  }
}

export const bodyBloggerIDValidator = new BodyBloggerIDValidator();
