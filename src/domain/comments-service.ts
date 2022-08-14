import { ObjectId } from 'mongodb';
import { CommentsRepository } from '../repositories/comments-db-repository';
import { PostsRepository } from '../repositories/posts-db-repository';
import { injectable } from 'inversify';
import { CommentsType } from '../types/comments-type';
import { UsersRepository } from '../repositories/users-db-repository';
import { LikeHelperClass } from './helperclass/like-helperclass';

@injectable()
export class CommentsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected commentsRepository: CommentsRepository,
    protected usersRepository: UsersRepository,
    protected likeHelperClass: LikeHelperClass,
  ) {
    this.postsRepository = postsRepository;
    this.commentsRepository = commentsRepository;
    this.usersRepository = usersRepository;
    this.likeHelperClass = likeHelperClass;
  }

  async createComment(
    content: string,
    userId: ObjectId,
    userLogin: string,
    postId: ObjectId,
  ): Promise<CommentsType | null> {
    const post = await this.postsRepository.getPostsById(postId);
    const user = await this.usersRepository.getUserById(userId);
    if (!user) throw new Error('User not exists');
    if (post) {
      const comment = {
        id: new ObjectId(),
        content: content,
        userId: user!.id,
        userLogin: user!.login,
        addedAt: new Date(),
        postId: post.id,
      };
      const createdComment = await this.commentsRepository.createComment(comment);
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
  }

  async deleteCommentById(id: ObjectId): Promise<boolean> {
    return this.commentsRepository.deleteCommentById(id);
  }

  async updateComment(content: string, id: ObjectId): Promise<boolean> {
    return this.commentsRepository.updateCommentById(id, content);
  }
  async getCommentById(id: ObjectId): Promise<CommentsType | null> {
    return this.commentsRepository.getCommentById(id);
  }

  async updateLikeStatus(likeStatus: string, postId: ObjectId, userId: ObjectId, login: string) {
    let comment: CommentsType | null = await this.commentsRepository.getCommentById(postId);

    if (comment) {
      return this.likeHelperClass.createLike(likeStatus, postId, userId, login);
    }
    return null;
  }
}
