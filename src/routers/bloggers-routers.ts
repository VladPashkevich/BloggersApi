import { Request, Response, Router } from 'express';
import { paramBloggerIDValidator } from '../middlewares/idValidator';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { nameValidator } from '../middlewares/nameValidator';
import { youtubeUrlValidator } from '../middlewares/youtubeUrlValidator';
import { bloggersService } from '../domain/bloggers-service';
import basicAuth from '../middlewares/basicAuth';
import { titleValidator } from '../middlewares/titleValidator';
import { shortDescriptionValidator } from '../middlewares/shortDescriptionValidator';
import { contentValidator } from '../middlewares/contentValidator';
import { paramBloggerIdValidator } from '../middlewares/paramBloggersIdValidator';

export const bloggersRouter = Router({});

bloggersRouter.get('/', async (req: Request, res: Response) => {
  const searchNameTerm = (req.query.SearchNameTerm as string) || '';
  const pageNumber = Number(req.query.PageNumber) || 1;
  const pageSize = Number(req.query.PageSize) || 10;
  const allBloggers = await bloggersService.getBloggers(pageNumber, pageSize, searchNameTerm);
  res.send(allBloggers);
});

bloggersRouter.get('/:bloggerId', paramBloggerIDValidator, async (req: Request, res: Response) => {
  const blogger = await bloggersService.getBloggersById(+req.params.bloggerId);
  if (blogger) {
    res.send(blogger);
  } else {
    res.send(404);
  }
});

bloggersRouter.get('/:bloggerId/posts', async (req: Request, res: Response) => {
  const blogger = await bloggersService.getBloggersById(+req.params.bloggerId);
  if (!blogger) {
    return res.send(404);
  }
  const pageNumber = Number(req.query.PageNumber) || 1;
  const pageSize = Number(req.query.PageSize) || 10;
  const allPostsOfBlogger = await bloggersService.getPostsByBloggerId(
    +req.params.bloggerId,
    pageNumber,
    pageSize,
  );
  res.status(200).send(allPostsOfBlogger);
});

bloggersRouter.post(
  '/',
  basicAuth,
  nameValidator,
  youtubeUrlValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newBlogger = await bloggersService.createdBlogger(req.body.name, req.body.youtubeUrl);
    res.status(201).send(newBlogger);
  },
);

bloggersRouter.post(
  '/:bloggerId/posts',
  basicAuth,
  titleValidator,
  shortDescriptionValidator,
  paramBloggerIdValidator,
  contentValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const blogger = await bloggersService.getBloggersById(+req.params.bloggerId);
    if (!blogger) {
      return res.send(404);
    }
    const post = await bloggersService.createdPostByBloggerId(
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      +req.params.bloggerId,
    );
    if (post) {
      res.status(201).send(post);
    } else {
      res.send(404);
    }
  },
);

bloggersRouter.put(
  '/:bloggerId',
  basicAuth,
  paramBloggerIDValidator,
  nameValidator,
  youtubeUrlValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const blogger = await bloggersService.getBloggersById(+req.params.bloggerId);
    if (!blogger) {
      return res.send(404);
    }
    const updateBlogger = await bloggersService.updateBlogger(
      +req.params.bloggerId,
      req.body.name,
      req.body.youtubeUrl,
    );

    if (updateBlogger) {
      res.sendStatus(204);
    } else {
      res.send(404);
    }
  },
);

bloggersRouter.delete(
  '/:bloggerId',
  basicAuth,
  paramBloggerIDValidator,
  async (req: Request, res: Response) => {
    const isDelete = await bloggersService.deleteBloggerById(+req.params.bloggerId);
    if (isDelete) {
      res.send(204);
    } else {
      res.sendStatus(404);
    }
  },
);
