import { body } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { BloggersService } from '../domain/bloggers-service';
import { LikeHelperClass } from '../domain/helperclass/like-helperclass';
import { PostsHelper } from '../domain/helperclass/post-helperclass';
import { BloggersRepository } from '../repositories/bloggers-db-repository';
import { LikesRepository } from '../repositories/likes-repository';
import { PostsRepository } from '../repositories/posts-db-repository';
import { injectable } from 'inversify';

class BodyBloggerIDValidator {
  bloggersService: BloggersService;

  constructor() {
    const postrepo = new PostsRepository();
    const repo = new BloggersRepository();
    const like = new LikesRepository();
    const likeHelper = new LikeHelperClass(like);
    const postHelperClass = new PostsHelper(repo, postrepo, likeHelper);

    this.bloggersService = new BloggersService(repo, postrepo, postHelperClass);
  }

  async bloggerIdExist(req: Request, res: Response, next: NextFunction) {
    try {
      const blogger = await this.bloggersService.getBloggersById(new ObjectId(req.body.bloggerId));
      if (!blogger) {
        res.status(400).send({
          errorsMessages: [{ message: 'BloggerId does not exists ', field: 'bloggerId' }],
        });
        return;
      }
      next();
    } catch (e) {
      console.log(e);
    }
    next();
    return;
  }
}

/* async body('bloggerId').custom(async (bloggerId) => {
      const blogger = await this.bloggersService.getBloggersById(new ObjectId(bloggerId));

      if (!blogger) {
        throw new Error('BloggerId does not exists');
      }
      return true;
    }); */

const bodyBloggerIDValidator = new BodyBloggerIDValidator();
export const bloggerIdMiddleware =
  bodyBloggerIDValidator.bloggerIdExist.bind(bodyBloggerIDValidator);
