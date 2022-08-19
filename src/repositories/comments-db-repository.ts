import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import { CommentsModel } from './db';
import { injectable } from 'inversify';
import { CommentsType, CommentType } from '../types/comments-type';

interface CommentsData {
  comments: CommentsType[];
  totalCount: number;
}

@injectable()
export class CommentsRepository {
  async getCommentsByPostId(
    postId: ObjectId,
    pageNumber: number,
    pageSize: number,
  ): Promise<CommentsData> {
    const commentsFromDb = await CommentsModel.find({ postId: postId })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean();
    const totalCount = await CommentsModel.countDocuments({ postId: postId });
    let comments = commentsFromDb.map((c) => ({
      id: c._id,
      userId: c.userId,
      userLogin: c.userLogin,
      content: c.content,
      addedAt: c.addedAt,
    }));
    return {
      comments: comments,
      totalCount: totalCount,
    };
  }

  async createComment(newComment: CommentType): Promise<boolean> {
    const { id, ...rest } = newComment;
    const comment = await CommentsModel.insertMany({
      ...rest,
      _id: newComment.id,
    });
    if (comment) return true;
    return false;
  }

  async updateCommentById(id: ObjectId, content: string): Promise<boolean> {
    const result = await CommentsModel.updateOne({ _id: id }, { $set: { content: content } });
    return result.matchedCount === 1;
  }

  async getCommentById(id: ObjectId): Promise<CommentsType | null> {
    const comment = await CommentsModel.findOne({ _id: id });
    if (comment) {
      return {
        id: comment._id,
        userId: comment.userId,
        userLogin: comment.userLogin,
        content: comment.content,
        addedAt: comment.addedAt,
      };
    }
    return null;
  }

  async deleteCommentById(id: ObjectId): Promise<boolean> {
    let result = await CommentsModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async commentsCount(postId: ObjectId): Promise<number> {
    return CommentsModel.countDocuments({ postId: postId });
  }
}
