import { Router, Request, Response } from 'express';
import { CommentsController } from '../controllers/comments-controller';
import { userIdValidator } from '../middlewares/commentExistValidator';
import { contentCommentValidator } from '../middlewares/commentsValidation';
import { mongoIdValidator } from '../middlewares/idValidator';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { likeOrDislakeValidation, likeStatusValidation } from '../middlewares/like-validator';
import { userAuthMiddleware } from '../middlewares/users-auth-middleware';
import { container } from '../root/composition-root';

const commentsController = container.resolve(CommentsController);

export const commentsRouter = Router({});

/*commentsRouter.put(
  '/:commentId',
  usersAuthMiddleware,
  mongoIdValidator('commentId'),
  userIdValidator,
  contentCommentValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newComment = await commentsService.updateComment(
      req.body.content,
      new ObjectId(req.params.commentId),
    );
    res.status(204).send(newComment);
  },
);*/

commentsRouter.put(
  '/:commentId',
  userAuthMiddleware,
  mongoIdValidator('commentId'),
  userIdValidator,
  contentCommentValidator,
  inputValidationMiddleware,
  commentsController.updateCommment.bind(commentsController),
);

/*commentsRouter.get(
  '/:commentId',
  mongoIdValidator('commentId'),
  async (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(new ObjectId(req.params.commentId));
    if (comment) {
      res.status(200).send(comment);
    } else {
      res.send(404);
    }
  },
);*/

commentsRouter.get(
  '/:commentId',
  mongoIdValidator('commentId'),
  commentsController.getCommentByID.bind(commentsController),
);

/*commentsRouter.delete(
  '/:commentId',
  usersAuthMiddleware,
  mongoIdValidator('commentId'),
  userIdValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const isDelete = await commentsService.deleteCommentById(new ObjectId(req.params.commentId));
    if (isDelete) {
      res.sendStatus(204);
    } else {
      res.send(404);
    }
  },
);*/

commentsRouter.delete(
  '/:commentId',
  userAuthMiddleware,
  mongoIdValidator('commentId'),
  userIdValidator,
  inputValidationMiddleware,
  commentsController.deleteComment.bind(commentsController),
);

commentsRouter.put(
  '/:commentId/like-status',
  userAuthMiddleware,
  mongoIdValidator('commentId'),
  likeStatusValidation,
  inputValidationMiddleware,
  likeOrDislakeValidation,

  commentsController.updateLikeStatus.bind(commentsController),
);
