import { param } from 'express-validator';
import { ObjectId } from 'mongodb';
import { commentsService } from '../domain/comments-service';
import { commentsRepository } from '../repositories/comments-db-repository';
import { Request, Response, NextFunction } from 'express';

export const paramPostIDValidator = param('postId')
  .exists()
  .withMessage('Value should be exists')
  .notEmpty()
  .withMessage('Value should be not empty')
  .isString()
  .withMessage('Value should be string');

export const postIdValidator = async (req: Request, res: Response, next: NextFunction) => {
  const postId = req.params.postId;
  const comment = await commentsRepository.getCommentById(new ObjectId(postId));
  if (!comment) {
    res.sendStatus(403);
  } else {
    next();
  }
};
