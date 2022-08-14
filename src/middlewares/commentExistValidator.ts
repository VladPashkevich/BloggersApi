import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { CommentsModel } from '../repositories/db';

export const userIdValidator = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const id = new ObjectId(req.params.commentId);
  if (!userId) {
    res.sendStatus(401);
    return;
  }
  const comment = await CommentsModel.findOne({ _id: id });
  if (!comment) {
    res.sendStatus(404);
    return;
  }
  if (comment.userId.toString() !== userId.toString()) {
    res.sendStatus(403);
  } else {
    next();
  }
};
