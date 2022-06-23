import { Request, Response, Router } from 'express';
import { bodyBloggerIDValidator } from '../middlewares/bloggerIdValidator';
import { contentValidator } from '../middlewares/contentValidator';
import { paramPostIDValidator } from '../middlewares/idValidator';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { shortDescriptionValidator } from '../middlewares/shortDescriptionValidator';
import { titleValidator } from '../middlewares/titleValidator';
import { postsService } from '../domain/posts-service';
import basicAuth from '../middlewares/basicAuth';

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request, res: Response) => {
  const pageNumber = Number(req.query.PageNumber) || 1;
  const pageSize = Number(req.query.PageSize) || 10;
  const allPosts = await postsService.getPosts(pageNumber, pageSize);
  res.status(200).send(allPosts);
});

postsRouter.post(
  '/',
  basicAuth,
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
      +req.body.bloggerId,
    );
    if (post) {
      res.status(201).send(post);
    } else {
      res.send(404);
    }
  },
);

postsRouter.put(
  '/:postId',
  basicAuth,
  paramPostIDValidator,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  bodyBloggerIDValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const post = await postsService.getPostsById(+req.params.postId);
    if (!post) {
      return res.send(404);
    }
    const updatePost = await postsService.updatePosts(
      +req.params.postId,
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      +req.body.bloggerId,
    );
    if (updatePost) {
      res.status(204).send(updatePost);
    } else {
      res.send(404);
    }
  },
);

postsRouter.get('/:postId', paramPostIDValidator, async (req: Request, res: Response) => {
  const post = await postsService.getPostsById(+req.params.postId);
  if (post) {
    res.status(200).send(post);
  } else {
    res.send(404);
  }
});

postsRouter.delete(
  '/:postId',
  basicAuth,
  paramPostIDValidator,
  async (req: Request, res: Response) => {
    const isDelete = await postsService.deletePostsById(+req.params.postId);

    if (isDelete) {
      res.send(204);
    } else {
      res.sendStatus(404);
    }
  },
);
