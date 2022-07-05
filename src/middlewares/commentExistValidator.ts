import { param } from 'express-validator';
import { ObjectId } from 'mongodb';
import { commentsRepository } from '../repositories/comments-db-repository';
import { Request, Response, NextFunction } from 'express';

export const paramPostIDValidator = param('postId').isMongoId();

export const postIdValidator = async (req: Request, res: Response, next: NextFunction) => {
  const postId = req.params.postId;
  const comment = await commentsRepository.getCommentById(new ObjectId(postId));
  if (!comment) {
    res.sendStatus(403);
  } else {
    next();
  }
};
