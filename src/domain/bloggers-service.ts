import { ObjectId } from 'mongodb';
import { bloggersRepository } from '../repositories/bloggers-db-repository';
import { postsRepository } from '../repositories/posts-db-repository';
import { BloggersType, BloggersDBType, PostsDBType, PostsType } from '../repositories/types';

export const bloggersService = {
  async getBloggers(
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<BloggersDBType> {
    const { bloggers, totalCount } = await bloggersRepository.getBloggers(
      pageNumber,
      pageSize,
      searchNameTerm,
    );
    const result: BloggersDBType = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: bloggers,
    };
    return result;
  },
  async getPostsByBloggerId(
    bloggerId: ObjectId,
    pageNumber: number,
    pageSize: number,
  ): Promise<PostsDBType> {
    const { posts, totalCount } = await postsRepository.getPostsByBloggerId(
      bloggerId,
      pageNumber,
      pageSize,
    );
    const result: PostsDBType = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: posts,
    };
    return result;
  },

  async getBloggersById(id: ObjectId): Promise<BloggersType | null> {
    return bloggersRepository.getBloggersById(id);
  },

  async deleteBloggerById(id: ObjectId): Promise<boolean> {
    return bloggersRepository.deleteBloggerById(id);
  },

  async createdBlogger(name: string, youtubeUrl: string): Promise<BloggersType | null> {
    const newBlogger = {
      id: new ObjectId(),
      name: name,
      youtubeUrl: youtubeUrl,
    };
    const creatededBlogger = await bloggersRepository.createdBlogger(newBlogger);
    if (creatededBlogger) {
      return newBlogger;
    }

    return null;
  },

  async createdPostByBloggerId(
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
  ): Promise<PostsType | null> {
    const blogger = await bloggersRepository.getBloggersById(bloggerId);
    if (blogger) {
      const newPost = {
        id: new ObjectId(),
        title: title,
        shortDescription: shortDescription,
        content: content,
        bloggerId: bloggerId,
        bloggerName: blogger.name,
      };
      await postsRepository.createdPosts(newPost);
      return newPost;
    } else {
      return null;
    }
  },

  async updateBlogger(id: ObjectId, name: string, youtubeUrl: string): Promise<boolean> {
    return bloggersRepository.updateBlogger(id, name, youtubeUrl);
  },
};
