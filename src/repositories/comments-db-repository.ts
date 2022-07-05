import { ObjectId } from 'mongodb';
import { commentsCollection } from './db';
import { CommentsType, CommentType } from './types';

interface CommentsData {
  comments: CommentType[];
  totalCount: number;
}

export const commentsRepository = {
  async getCommentsByPostId(
    postId: ObjectId,
    pageNumber: number,
    pageSize: number,
  ): Promise<CommentsData> {
    const commentsFromDb = await commentsCollection
      .find({ postId: postId })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .toArray();
    const totalCount = await commentsCollection.countDocuments({ postId: postId });
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
  },

  async createComment(newComment: CommentsType): Promise<boolean> {
    const { id, ...rest } = newComment;
    const comment = await commentsCollection.insertOne({
      ...rest,
      _id: newComment.id,
    });
    return comment.acknowledged;
  },

  async updateCommentById(id: ObjectId, content: string): Promise<boolean> {
    const result = await commentsCollection.updateOne({ _id: id }, { $set: { content: content } });
    return result.matchedCount === 1;
  },

  async getCommentById(id: ObjectId): Promise<CommentType | null> {
    const comment = await commentsCollection.findOne({ _id: id });
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
  },

  async deleteCommentById(id: ObjectId): Promise<boolean> {
    let result = await commentsCollection.deleteOne({ _id: id });
    return result.deletedCount === 1;
  },
};
