import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { commentsService } from '../domain/comments-service';
import { userIdValidator } from '../middlewares/commentExistValidator';
import { contentCommentValidator } from '../middlewares/commentsValidation';
import { mongoIdValidator } from '../middlewares/idValidator';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { usersAuthMiddleware } from '../middlewares/users-auth-middleware';

export const commentsRouter = Router({});

commentsRouter.put(
  '/:commentId',
  usersAuthMiddleware,
  mongoIdValidator('commentId'),
  userIdValidator,

  contentCommentValidator,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newComment = await commentsService.createComment(
      req.body.comment,
      req.user!.id,
      req.user!.login,
      new ObjectId(req.params.commentId),
    );
    res.status(204).send(newComment);
  },
);

commentsRouter.get(
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
);

commentsRouter.delete(
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
);
