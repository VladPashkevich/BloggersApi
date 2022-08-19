import { ObjectId } from 'mongodb';
import { BloggersRepository } from '../repositories/bloggers-db-repository';
import { CommentsRepository } from '../repositories/comments-db-repository';
import { PostsRepository } from '../repositories/posts-db-repository';
import { UsersRepository } from '../repositories/users-db-repository';
import { injectable } from 'inversify';
import { PostsResponseType, PostsType, PostsWithPaginationType } from '../types/posts-type';
import { LikeHelperClass } from './helperclass/like-helperclass';
import { LikesRepository } from '../repositories/likes-repository';
import { CommentsHelperClass } from './helperclass/comment-helperclass';
import { PostsHelper } from './helperclass/post-helperclass';
import { CommentsPaginationType, CommentsResponseType, CommentType } from '../types/comments-type';

@injectable()
export class PostsService {
  constructor(
    protected bloggersRepository: BloggersRepository,
    protected postsRepository: PostsRepository,
    protected likeHelperClass: LikeHelperClass,
    protected likeRepository: LikesRepository,
    protected commentsRepository: CommentsRepository,
    protected usersRepository: UsersRepository,
    protected commentsHelperClass: CommentsHelperClass,
    protected postsHelperClass: PostsHelper,
  ) {
    this.bloggersRepository = bloggersRepository;
    this.postsRepository = postsRepository;
    this.likeHelperClass = likeHelperClass;
    this.likeRepository = likeRepository;
    this.commentsRepository = commentsRepository;
    this.usersRepository = usersRepository;
    this.commentsHelperClass = commentsHelperClass;
    this.postsHelperClass = postsHelperClass;
  }

  async findPosts(
    pageNumber: number,
    pageSize: number,
    userId: ObjectId,
  ): Promise<PostsWithPaginationType> {
    return this.postsHelperClass.getPostsPagination(pageNumber, pageSize, userId);
  }

  async findPostById(postId: ObjectId, userId?: ObjectId): Promise<PostsResponseType | null> {
    const post: PostsType | null = await this.postsRepository.getPostsById(postId);
    if (post) {
      return this.postsHelperClass.makePostResponse(post, userId);
    }
    return null;
  }
  /*  async getPosts(pageNumber: number, pageSize: number): Promise<PostsDBType> {
    const { posts, totalCount } = await this.postsRepository.getPosts(pageNumber, pageSize);
    const result: PostsDBType = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: posts,
    };

    return result;
  } */

  /* async getCommentsByPostId(
    postId: ObjectId,
    pageNumber: number,
    pageSize: number,
  ): Promise<CommentsDBType> {
    const { comments, totalCount } = await this.commentsRepository.getCommentsByPostId(
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
  } */

  /* async getPostsById(id: ObjectId): Promise<PostsType | null> {
    return this.postsRepository.getPostsById(id);
  } */

  async getPostsById(id: ObjectId, userId?: ObjectId): Promise<PostsResponseType | null> {
    const post: PostsType | null = await this.postsRepository.getPostsById(id);
    if (post) {
      return this.postsHelperClass.makePostResponse(post, userId);
    }
    return null;
  }

  async deletePostsById(id: ObjectId): Promise<boolean> {
    return this.postsRepository.deletePostsById(id);
  }

  /*  async createLikeOrDislike(userId: ObjectId, postId: ObjectId): Promise<PostsLikes | null>{
    const user = await this.usersRepository.getUserById(userId);
    const post = await this.getPostsById(postId)
    const newlike: PostsLikes = {
      id: new ObjectId(),
      userId : user!.id,
      login: user!.login,
      postId: post!.id ,
      likesStatus: "None"
    }

    const likesDb = await this.postsRepository.createLikeOrDislike(newlike)
    if (likesDb){
      return newlike
    }else {
      return null
    }
  } */

  async createdPosts(
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
  ): Promise<PostsType | null | undefined> {
    const blogger = await this.bloggersRepository.getBloggersById(bloggerId);
    if (blogger) {
      const newPost: PostsType = {
        id: new ObjectId(),
        title,
        shortDescription,
        content,
        bloggerId: bloggerId,
        bloggerName: blogger!.name,
        addedAt: new Date(),
      };
      const makedPost = await this.postsRepository.createdPosts(newPost);
      if (makedPost) {
        let newPosts = await this.postsHelperClass.makePostResponse(makedPost);
        return newPosts;
      }
    } else {
      return null;
    }
  }

  async createComment(
    postId: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
  ): Promise<CommentType | null> {
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
        return comment;
      }
    }
    return null;
  }

  async sendAllCommentsByPostId(
    postId: ObjectId,
    pagenumber: number,
    pagesize: number,
    userId: ObjectId,
  ): Promise<CommentsPaginationType | null> {
    let post: PostsResponseType | null = await this.getPostsById(postId);
    console.log(post);
    if (post) {
      let allComments: CommentsPaginationType = await this.commentsHelperClass.sendAllComments(
        new ObjectId(postId),
        pagenumber,
        pagesize,
        userId,
      );
      return allComments;
    }
    return null;
  }

  async updatePosts(
    id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
  ): Promise<boolean | undefined> {
    return this.postsRepository.updatePosts(id, title, shortDescription, content, bloggerId);
  }

  async updateLikeStatus(likeStatus: string, postid: ObjectId, userId: ObjectId, login: string) {
    let post: PostsResponseType | null = await this.findPostById(postid);
    if (post) {
      return this.likeHelperClass.createLike(likeStatus, postid, userId, login);
    }
    return null;
  }
}
