import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { injectable } from 'inversify';
import { CommentsService } from '../domain/comments-service';

@injectable()
export class CommentsController {
  constructor(protected commentsService: CommentsService) {
    this.commentsService = commentsService;
  }

  async updateCommment(req: Request, res: Response) {
    const newComment = await this.commentsService.updateComment(
      req.body.content,
      new ObjectId(req.params.commentId),
    );
    res.status(204).send(newComment);
  }

  async getCommentByID(req: Request, res: Response) {
    const userId = new ObjectId(req.user?._id);
    const comment = await this.commentsService.getCommentById(
      new ObjectId(req.params.commentId),
      userId,
    );
    if (comment) {
      res.status(200).send(comment);
    } else {
      res.send(404);
    }
  }

  async deleteComment(req: Request, res: Response) {
    const isDelete = await this.commentsService.deleteCommentById(
      new ObjectId(req.params.commentId),
    );
    if (isDelete) {
      res.sendStatus(204);
    } else {
      res.send(404);
    }
  }

  async updateLikeStatus(req: Request, res: Response) {
    const isUpdated = await this.commentsService.updateLikeStatus(
      req.body.likeStatus,
      new ObjectId(req.params.commentId),
      req.user!._id,
      req.user!.accountData.login,
    );
    if (isUpdated) {
      res.sendStatus(204);
      return;
    }
    res.sendStatus(404);
  }
}
