import { Request, Response, Router } from 'express';
import expressBasicAuth from 'express-basic-auth';
import { idValidator } from '../middlewares/idValidator';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { nameValidator } from '../middlewares/nameValidator';
import { youtubeUrlValidator } from '../middlewares/youtubeUrlValidator';
import { bloggersRepository } from '../repositories/bloggers-repository';

export const bloggersRouter = Router({});

bloggersRouter.get('/', (req: Request, res: Response) => {
  const allBloggers = bloggersRepository.getBloggers();
  res.send(allBloggers);
});

bloggersRouter.get('/:bloggerId', (req: Request, res: Response) => {
  const blogger = bloggersRepository.getBloggersById(+req.params.bloggerId);
  if (blogger) {
    res.send(blogger);
  } else {
    res.send(404);
  }
});

bloggersRouter.post(
  '/',
  expressBasicAuth,
  nameValidator,
  youtubeUrlValidator,
  inputValidationMiddleware,
  (req: Request, res: Response) => {
    const newBlogger = bloggersRepository.createdBlogger(req.body.name, req.body.youtubeUrl);
    res.status(201).send(newBlogger);
  },
);

bloggersRouter.put(
  '/:bloggerId',
  expressBasicAuth,
  idValidator,
  nameValidator,
  youtubeUrlValidator,
  inputValidationMiddleware,
  (req: Request, res: Response) => {
    const updateBlogger = bloggersRepository.updateBlogger(
      +req.params.bloggerId,
      req.body.name,
      req.body.youtubeUrl,
    );

    if (updateBlogger) {
      res.status(204).send(updateBlogger);
    } else {
      res.send(404);
    }
  },
);

bloggersRouter.delete('/:bloggerId', expressBasicAuth, (req: Request, res: Response) => {
  const isDelete = bloggersRepository.deleteBloggerById(+req.params.bloggerId);
  if (isDelete) {
    res.send(204);
  } else {
    res.sendStatus(404);
  }
});
