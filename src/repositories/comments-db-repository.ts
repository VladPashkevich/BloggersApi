import { ObjectId } from 'mongodb';
import { commentsCollection } from './db';
import { CommentsType } from './types';
import { usersRepository } from './users-db-repository';

interface CommentsData {
  comments: CommentsType[];
  totalCount: number;
}

export const commentsRepository = {
  async getAllComments(): Promise<CommentsType[]> {
    return commentsCollection.find().sort('createAt', -1).toArray();
  },

  async getCommentsByPostId(
    postId: ObjectId,
    pageNumber: number,
    pageSize: number,
  ): Promise<CommentsData> {
    const comments = await commentsCollection
      .find({ postId: postId })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .toArray();
    const totalCount = await commentsCollection.countDocuments({ postId: postId });
    return {
      comments: comments,
      totalCount: totalCount,
    };
  },

  async createComment(comment: CommentsType): Promise<CommentsType> {
    await commentsCollection.insertOne(comment);
    return comment;
  },

  async updateCommentById(id: ObjectId, content: string): Promise<boolean> {
    const result = await commentsCollection.updateOne({ id: id }, { $set: { content: content } });
    return result.matchedCount === 1;
  },

  async getCommentById(id: ObjectId): Promise<CommentsType | null> {
    const comment = await commentsCollection.findOne({ _id: id });
    return comment;
  },

  async deleteCommentById(id: ObjectId): Promise<boolean> {
    let result = await commentsCollection.deleteOne(id);
    return result.deletedCount === 1;
  },
};
