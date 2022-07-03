import { ObjectId } from 'mongodb';
import { commentsRepository } from '../repositories/comments-db-repository';
import { CommentsType } from '../repositories/types';

export const commentsService = {
  async getAllComments(): Promise<CommentsType[]> {
    return commentsRepository.getAllComments();
  },
  async createComment(
    content: string,
    userId: ObjectId,
    userLogin: string,
    postId: ObjectId,
  ): Promise<CommentsType> {
    const comment: CommentsType = {
      _id: postId,
      userId: userId,
      userLogin: userLogin,
      content: content,
      addeAt: new Date(),
    };
    return commentsRepository.createComment(comment);
  },

  async deleteCommentById(id: ObjectId): Promise<boolean> {
    return commentsRepository.deleteCommentById(id);
  },

  async updateComment(content: string, id: ObjectId): Promise<boolean> {
    return commentsRepository.updateCommentById(id, content);
  },
};
