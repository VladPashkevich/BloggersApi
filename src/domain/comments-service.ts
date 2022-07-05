import { ObjectId } from 'mongodb';
import { commentsRepository } from '../repositories/comments-db-repository';
import { postsRepository } from '../repositories/posts-db-repository';
import { CommentsType, CommentType } from '../repositories/types';

export const commentsService = {
  async createComment(
    content: string,
    userId: ObjectId,
    userLogin: string,
    postId: ObjectId,
  ): Promise<Omit<CommentsType, 'postId'> | null> {
    const post = await postsRepository.getPostsById(postId);
    if (post) {
      const comment: CommentsType = {
        id: new ObjectId(),
        userId: userId,
        userLogin: userLogin,
        content: content,
        addedAt: new Date(),
        postId: post.id,
      };
      const createdComment = await commentsRepository.createComment(comment);
      if (createdComment) {
        return {
          id: comment.id,
          userId: comment.userId,
          userLogin: comment.userLogin,
          content: comment.content,
          addedAt: comment.addedAt,
        };
      } else {
        return null;
      }
    }
    return null;
  },

  async deleteCommentById(id: ObjectId): Promise<boolean> {
    return commentsRepository.deleteCommentById(id);
  },

  async updateComment(content: string, id: ObjectId): Promise<boolean> {
    return commentsRepository.updateCommentById(id, content);
  },
  async getCommentById(id: ObjectId): Promise<CommentType | null> {
    return commentsRepository.getCommentById(id);
  },
};
