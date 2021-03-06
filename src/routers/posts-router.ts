import { Request, Response, Router } from 'express';
import { bodyBloggerIDValidator } from '../middlewares/bloggerIdValidator';
import { contentValidator } from '../middlewares/contentValidator';
import { mongoIdValidator } from '../middlewares/idValidator';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { shortDescriptionValidator } from '../middlewares/shortDescriptionValidator';
import { titleValidator } from '../middlewares/titleValidator';
import { postsService } from '../domain/posts-service';
import { superAdminAuthMiddleware } from '../middlewares/basicAutht';
import { commentsService } from '../domain/comments-service';
import { ObjectId } from 'mongodb';
import { commentsRepository } from '../repositories/comments-db-repository';
import { usersAuthMiddleware } from '../middlewares/users-auth-middleware';
import { contentCommentValidator } from '../middlewares/commentsValidation';

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request, res: Response) => {
  const pageNumber = Number(req.query.PageNumber) || 1;
  const pageSize = Number(req.query.PageSize) || 10;
  const allPosts = await postsService.getPosts(pageNumber, pageSize);
  res.status(200).send(allPosts);
});

postsRouter.get(
  '/:postId/comments',
  mongoIdValidator('postId'),
  async (req: Request, res: Response) => {
    const pageNumber = Number(req.query.PageNumber) || 1;
    const pageSize = Number(req.query.PageSize) || 10;
    const postId = new ObjectId(req.params.postId);
    const allPosts = await postsService.getCommentsByPostId(postId, pageNumber, pageSize);
    res.status(200).send(allPosts);
  },
);

postsRouter.post(
  '/',
  superAdminAuthMiddleware,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  bodyBloggerIDValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const post = await postsService.createdPosts(
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      new ObjectId(req.body.bloggerId),
    );
    if (post) {
      res.status(201).send(post);
    } else {
      res.send(404);
    }
  },
);

postsRouter.post(
  '/:postId/comments',
  usersAuthMiddleware,
  mongoIdValidator('postId'),
  contentCommentValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const postId = new ObjectId(req.params.postId);
    const post = await postsService.getPostsById(postId);
    if (!post) {
      res.send(404);
      return;
    }
    const comment = await commentsService.createComment(
      req.body.content,
      req.user!._id,
      req.user!.accountData.login,
      postId,
    );
    if (comment) {
      res.status(201).send(comment);
    } else {
      res.send(404);
    }
  },
);

postsRouter.put(
  '/:postId',
  superAdminAuthMiddleware,
  mongoIdValidator('postId'),
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  bodyBloggerIDValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const postId = new ObjectId(req.params.postId);
    const post = await postsService.getPostsById(postId);
    if (!post) {
      return res.send(404);
    }
    const updatePost = await postsService.updatePosts(
      postId,
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      new ObjectId(req.body.bloggerId),
    );
    if (updatePost) {
      res.status(204).send(updatePost);
    } else {
      res.send(404);
    }
  },
);

postsRouter.get(
  '/:postId',
  mongoIdValidator('postId'),
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const post = await postsService.getPostsById(new ObjectId(req.params.postId));
    if (post) {
      res.status(200).send(post);
    } else {
      res.send(404);
    }
  },
);

postsRouter.delete(
  '/:postId',
  superAdminAuthMiddleware,
  mongoIdValidator('postId'),
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const isDelete = await postsService.deletePostsById(new ObjectId(req.params.postId));

    if (isDelete) {
      res.send(204);
    } else {
      res.sendStatus(404);
    }
  },
);
