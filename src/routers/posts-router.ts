import { Request, Response, Router } from 'express';
import { contentValidator } from '../middlewares/contentValidator';
import { mongoIdValidator } from '../middlewares/idValidator';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { shortDescriptionValidator } from '../middlewares/shortDescriptionValidator';
import { titleValidator } from '../middlewares/titleValidator';
import { superAdminAuthMiddleware } from '../middlewares/basicAutht';
import { userAuthMiddleware } from '../middlewares/users-auth-middleware';
import { contentCommentValidator } from '../middlewares/commentsValidation';
import { container } from '../root/composition-root';
import { PostsController } from '../controllers/posts-controllers';
import { bloggerIdMiddleware } from '../middlewares/bloggerIdValidator';
import { JWTService } from '../application/jwt-service';
import { UsersService } from '../domain/users-service';
import { likeOrDislakeValidation, likeStatusValidation } from '../middlewares/like-validator';
import { userIdMiddleware } from '../middlewares/userIDmiddleware';

export const postsRouter = Router({});

const postsController = container.resolve(PostsController);

/*postsRouter.get('/', async (req: Request, res: Response) => {
  const pageNumber = Number(req.query.PageNumber) || 1;
  const pageSize = Number(req.query.PageSize) || 10;
  const allPosts = await postsService.getPosts(pageNumber, pageSize);
  res.status(200).send(allPosts);
});*/

postsRouter.get('/', userIdMiddleware, postsController.getAllPosts.bind(postsController));

/*postsRouter.get(
  '/:postId/comments',
  mongoIdValidator('postId'),
  async (req: Request, res: Response) => {
    const pageNumber = Number(req.query.PageNumber) || 1;
    const pageSize = Number(req.query.PageSize) || 10;
    const postId = new ObjectId(req.params.postId);
    const allPosts = await postsService.getCommentsByPostId(postId, pageNumber, pageSize);
    res.status(200).send(allPosts);
  },
);*/

postsRouter.get(
  '/:postId/comments',
  mongoIdValidator('postId'),
  postsController.getCommentsByPostID.bind(postsController),
);

/*postsRouter.post(
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
);*/

postsRouter.post(
  '/',
  superAdminAuthMiddleware,
  mongoIdValidator('bloggerId'),
  titleValidator,
  shortDescriptionValidator,
  contentValidator,

  inputValidationMiddleware,
  postsController.createPost.bind(postsController),
);

/* postsRouter.post(
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
); */

postsRouter.post(
  '/:postId/comments',
  userAuthMiddleware,
  mongoIdValidator('postId'),
  contentCommentValidator,
  inputValidationMiddleware,
  postsController.createCommentByPostID.bind(postsController),
);

/*postsRouter.put(
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
);*/

postsRouter.put(
  '/:postId',
  superAdminAuthMiddleware,
  mongoIdValidator('postId'),
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  inputValidationMiddleware,
  postsController.updatePost.bind(postsController),
);

/*postsRouter.get(
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
);*/

postsRouter.get(
  '/:postId',
  mongoIdValidator('postId'),
  inputValidationMiddleware,
  postsController.getPostByID.bind(postsController),
);

/*postsRouter.delete(
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
);*/

postsRouter.delete(
  '/:postId',
  superAdminAuthMiddleware,
  mongoIdValidator('postId'),
  inputValidationMiddleware,
  postsController.deletePost.bind(postsController),
);

postsRouter.put(
  '/:postId/like-status',
  userAuthMiddleware,
  mongoIdValidator('postId'),
  likeStatusValidation,
  inputValidationMiddleware,
  likeOrDislakeValidation,
  postsController.updateLikeStatus.bind(postsController),
);
