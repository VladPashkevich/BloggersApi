import { Request, Response, Router } from 'express';
import { bloggerIdValidator } from '../middlewares/bloggerIdValidator';
import { contentValidator } from '../middlewares/contentValidator';
import { postIDValidator } from '../middlewares/idValidator';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { shortDescriptionValidator } from '../middlewares/shortDescriptionValidator';
import { titleValidator } from '../middlewares/titleValidator';
import { postsRepository } from '../repositories/posts-repository';
import basicAuth from '../middlewares/basicAuth';

export const postsRouter = Router({});

postsRouter.get('/', (req: Request, res: Response) => {
  const allPosts = postsRepository.getPosts();
  res.status(200).send(allPosts);
});

postsRouter.post(
  '/',
  basicAuth,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  bloggerIdValidator,
  inputValidationMiddleware,
  (req: Request, res: Response) => {
    const post = postsRepository.createdPosts(
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
  postIDValidator,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  bloggerIdValidator,
  inputValidationMiddleware,
  (req: Request, res: Response) => {
    const updatePost = postsRepository.updatePosts(
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

postsRouter.get('/:postId', postIDValidator, (req: Request, res: Response) => {
  const post = postsRepository.getPostsById(+req.params.postId);
  if (post) {
    res.status(200).send(post);
  } else {
    res.send(404);
  }
});

postsRouter.delete('/:postId', basicAuth, postIDValidator, (req: Request, res: Response) => {
  const isDelete = postsRepository.deletePostsById(+req.params.postId);

  if (isDelete) {
    res.send(204);
  } else {
    res.sendStatus(404);
  }
});
