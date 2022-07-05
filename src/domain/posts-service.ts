import { ObjectId } from 'mongodb';
import { bloggersRepository } from '../repositories/bloggers-db-repository';
import { commentsRepository } from '../repositories/comments-db-repository';
import { postsRepository } from '../repositories/posts-db-repository';
import {
  CommentsDBType,
  CommentsType,
  CommentType,
  PostsDBType,
  PostsType,
} from '../repositories/types';
import { usersRepository } from '../repositories/users-db-repository';

export const postsService = {
  async getPosts(pageNumber: number, pageSize: number): Promise<PostsDBType> {
    const { posts, totalCount } = await postsRepository.getPosts(pageNumber, pageSize);
    const result: PostsDBType = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: posts,
    };

    return result;
  },

  async getCommentsByPostId(
    postId: ObjectId,
    pageNumber: number,
    pageSize: number,
  ): Promise<CommentsDBType> {
    const { comments, totalCount } = await commentsRepository.getCommentsByPostId(
      postId,
      pageNumber,
      pageSize,
    );
    const result: CommentsDBType = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: comments,
    };
    return result;
  },

  async getPostsById(id: ObjectId): Promise<PostsType | null> {
    return postsRepository.getPostsById(id);
  },

  async deletePostsById(id: ObjectId): Promise<boolean> {
    return postsRepository.deletePostsById(id);
  },

  async createdPosts(
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
  ): Promise<PostsType | null> {
    const blogger = await bloggersRepository.getBloggersById(bloggerId);

    const newPost = {
      id: new ObjectId(),
      title: title,
      shortDescription: shortDescription,
      content: content,
      bloggerId: bloggerId,
      bloggerName: blogger!.name,
    };
    const creatededPost = await postsRepository.createdPosts(newPost);
    if (creatededPost) {
      return newPost;
    } else {
      return null;
    }
  },

  async createComment(
    postId: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
  ): Promise<CommentType | null> {
    const post = await postsRepository.getPostsById(postId);
    const user = await usersRepository.getUserById(userId);
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
      const createdComment = await commentsRepository.createComment(comment);
      if (createdComment) {
        return comment;
      }
    }
    return null;
  },

  async updatePosts(
    id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
  ): Promise<boolean | undefined> {
    return postsRepository.updatePosts(id, title, shortDescription, content, bloggerId);
  },
};
