import { Request, Response, Router } from 'express';
import { mongoIdValidator } from '../middlewares/idValidator';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { nameValidator } from '../middlewares/nameValidator';
import { youtubeUrlValidator } from '../middlewares/youtubeUrlValidator';
import { superAdminAuthMiddleware } from '../middlewares/basicAutht';
import { titleValidator } from '../middlewares/titleValidator';
import { shortDescriptionValidator } from '../middlewares/shortDescriptionValidator';
import { contentValidator } from '../middlewares/contentValidator';
import { BloggersController } from '../controllers/bloggers-controller';
import { container } from '../root/composition-root';

const bloggersController = container.resolve(BloggersController);

export const bloggersRouter = Router({});

/*bloggersRouter.get('/', async (req: Request, res: Response) => {
  const searchNameTerm = (req.query.SearchNameTerm as string) || '';
  const pageNumber = Number(req.query.PageNumber) || 1;
  const pageSize = Number(req.query.PageSize) || 10;
  const allBloggers = await bloggersService.getBloggers(pageNumber, pageSize, searchNameTerm);
  res.send(allBloggers);
});*/

bloggersRouter.get('/', bloggersController.getAllBloggers.bind(bloggersController));

/*bloggersRouter.get(
  '/:bloggerId',
  mongoIdValidator('bloggerId'),
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const blogger = await bloggersService.getBloggersById(new ObjectId(req.params.bloggerId));
    if (blogger) {
      res.send(blogger);
    } else {
      res.send(404);
    }
  },
);*/

bloggersRouter.get(
  '/:bloggerId',
  mongoIdValidator('bloggerId'),
  inputValidationMiddleware,
  bloggersController.deleteBloggerByID.bind(bloggersController),
);

/*bloggersRouter.get(
  '/:bloggerId/posts',
  mongoIdValidator('bloggerId'),
  async (req: Request, res: Response) => {
    const blogger = await bloggersService.getBloggersById(new ObjectId(req.params.bloggerId));
    if (!blogger) {
      return res.send(404);
    }
    const pageNumber = Number(req.query.PageNumber) || 1;
    const pageSize = Number(req.query.PageSize) || 10;
    const allPostsOfBlogger = await bloggersService.getPostsByBloggerId(
      new ObjectId(req.params.bloggerId),
      pageNumber,
      pageSize,
    );
    res.status(200).send(allPostsOfBlogger);
  },
);*/

bloggersRouter.get(
  '/:bloggerId/posts',
  mongoIdValidator('bloggerId'),
  bloggersController.getPostByBloggerID.bind(bloggersController),
);

/*bloggersRouter.post(
  '/',
  superAdminAuthMiddleware,
  nameValidator,
  youtubeUrlValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newBlogger = await bloggersService.createdBlogger(req.body.name, req.body.youtubeUrl);
    res.status(201).send(newBlogger);
  },
);*/

bloggersRouter.post(
  '/',
  superAdminAuthMiddleware,
  nameValidator,
  youtubeUrlValidator,
  inputValidationMiddleware,
  bloggersController.createBlogger.bind(bloggersController),
);

/*bloggersRouter.post(
  '/:bloggerId/posts',
  superAdminAuthMiddleware,
  titleValidator,
  shortDescriptionValidator,
  mongoIdValidator('bloggerId'),
  contentValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const blogger = await bloggersService.getBloggersById(new ObjectId(req.params.bloggerId));
    if (!blogger) {
      return res.send(404);
    }
    const post = await bloggersService.createdPostByBloggerId(
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      new ObjectId(req.params.bloggerId),
    );
    if (post) {
      res.status(201).send(post);
    } else {
      res.send(404);
    }
  },
);*/

bloggersRouter.post(
  '/:bloggerId/posts',
  superAdminAuthMiddleware,
  titleValidator,
  shortDescriptionValidator,
  mongoIdValidator('bloggerId'),
  contentValidator,
  inputValidationMiddleware,
  bloggersController.createPostByBloggerID.bind(bloggersController),
);

/*bloggersRouter.put(
  '/:bloggerId',
  superAdminAuthMiddleware,
  mongoIdValidator('bloggerId'),
  nameValidator,
  youtubeUrlValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const blogerId = new ObjectId(req.params.bloggerId);
    const blogger = await bloggersService.getBloggersById(blogerId);

    console.log(blogger);
    if (!blogger) {
      return res.send(404);
    }
    const updateBlogger = await bloggersService.updateBlogger(
      blogerId,
      req.body.name,
      req.body.youtubeUrl,
    );

    if (updateBlogger) {
      res.sendStatus(204);
    } else {
      res.send(404);
    }
  },
);*/

bloggersRouter.put(
  '/:bloggerId',
  superAdminAuthMiddleware,
  mongoIdValidator('bloggerId'),
  nameValidator,
  youtubeUrlValidator,
  inputValidationMiddleware,
  bloggersController.updateBlogger.bind(bloggersController),
);

/*bloggersRouter.delete(
  '/:bloggerId',
  superAdminAuthMiddleware,
  mongoIdValidator('bloggerId'),
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const isDelete = await bloggersService.deleteBloggerById(new ObjectId(req.params.bloggerId));
    if (isDelete) {
      res.send(204);
    } else {
      res.sendStatus(404);
    }
  },
);*/

bloggersRouter.delete(
  '/:bloggerId',
  superAdminAuthMiddleware,
  mongoIdValidator('bloggerId'),
  inputValidationMiddleware,
  bloggersController.deleteBloggerByID.bind(bloggersController),
);
