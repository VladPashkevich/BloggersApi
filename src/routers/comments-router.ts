import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { commentsService } from '../domain/comments-service';
import { postIdValidator } from '../middlewares/commentExistValidator';
import { usersAuthMiddleware } from '../middlewares/users-auth-middleware';

export const commentsRouter = Router({});

commentsRouter.put(
  '/:commentId',
  usersAuthMiddleware,
  postIdValidator,
  async (req: Request, res: Response) => {
    const newComment = await commentsService.createComment(
      req.body.comment,
      req.user!.id,
      req.user!.login,
      new ObjectId(req.params.commentId),
    );
    res.status(201).send(newComment);
  },
);

commentsRouter.get('/', async (req: Request, res: Response) => {
  return commentsService.getAllComments();
});

commentsRouter.delete('/:commentId', async (req: Request, res: Response) => {
  const isDelete = await commentsService.deleteCommentById(new ObjectId(req.params.commentId));
  if (isDelete) {
    res.sendStatus(204);
  } else {
    res.send(404);
  }
});
