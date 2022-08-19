import { ObjectId } from 'mongodb';
import { BloggersRepository } from '../repositories/bloggers-db-repository';
import { PostsRepository } from '../repositories/posts-db-repository';

import { injectable } from 'inversify';
import {
  PostsDBType,
  PostsPaginationType,
  PostsResponseType,
  PostsType,
} from '../types/posts-type';
import { BloggersClass, BloggersPaginationType, BloggersType } from '../types/bloggers-type';
import { PostsHelper } from './helperclass/post-helperclass';

@injectable()
export class BloggersService {
  constructor(
    protected bloggersRepository: BloggersRepository,
    protected postsRepository: PostsRepository,
    protected postHelperClass: PostsHelper,
  ) {
    this.bloggersRepository = bloggersRepository;
    this.postsRepository = postsRepository;
    this.postHelperClass = postHelperClass;
  }

  async getBloggers(
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<BloggersPaginationType> {
    const { bloggers, totalCount } = await this.bloggersRepository.getBloggers(
      pageNumber,
      pageSize,
      searchNameTerm,
    );
    const result: BloggersPaginationType = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: bloggers,
    };
    return result;
  }
  async getPostsByBloggerId(
    bloggerId: ObjectId,
    pageNumber: number,
    pageSize: number,
    userId: ObjectId,
  ): Promise<PostsPaginationType | null> {
    let blogger: BloggersType | null = await this.bloggersRepository.getBloggersById(bloggerId);

    if (blogger) {
      return await this.postHelperClass.getPostsPaginationBloggerID(
        pageNumber,
        pageSize,
        userId,
        blogger.id,
      );
    }
    return null;
  }

  /* const { posts, totalCount } = await this.postsRepository.getPostsByBloggerId(
      bloggerId,
      pageNumber,
      pageSize,
    );
    const result: PostsPaginationType = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: posts,
    };
    return result;
  } */

  async getBloggersById(id: ObjectId): Promise<BloggersType | null> {
    return this.bloggersRepository.getBloggersById(id);
  }

  async deleteBloggerById(id: ObjectId): Promise<boolean> {
    return this.bloggersRepository.deleteBloggerById(id);
  }

  async createdBlogger(name: string, youtubeUrl: string): Promise<BloggersType | null> {
    const newBlogger = new BloggersClass(new ObjectId(), name, youtubeUrl);
    const creatededBlogger = await this.bloggersRepository.createdBlogger(newBlogger);
    if (creatededBlogger) {
      return newBlogger;
    }

    return null;
  }

  async createdPostByBloggerId(
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
  ): Promise<PostsResponseType | null | undefined> {
    const blogger = await this.bloggersRepository.getBloggersById(bloggerId);
    if (blogger) {
      const newPost: PostsType = {
        id: new ObjectId(),
        title: title,
        shortDescription: shortDescription,
        content: content,
        bloggerId: blogger.id,
        bloggerName: blogger!.name,
        addedAt: new Date(),
      };
      const makedPost = await this.postsRepository.createdPosts(newPost);
      if (makedPost) {
        let newPosts = await this.postHelperClass.makePostResponse(makedPost);
        return newPosts;
      }
    } else {
      return null;
    }
  }

  async updateBlogger(id: ObjectId, name: string, youtubeUrl: string): Promise<boolean> {
    return this.bloggersRepository.updateBlogger(id, name, youtubeUrl);
  }
}
