import { bloggersRepository } from '../repositories/bloggers-db-repository';
import { postsRepository } from '../repositories/posts-db-repository';
import { BloggersTypes, BloggersDBType, PostsDBType, PostsType } from '../repositories/types';

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
    bloggerId: number,
    pageNumber: number,
    pageSize: number,
  ): Promise<PostsDBType> {
    const { posts, totalCount } = await postsRepository.getPostsByBloggerId(
      bloggerId,
      pageNumber,
      pageSize,
    );
    const result: PostsDBType = {
      pagesCount: Math.ceil(totalCount / 10),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: posts,
    };
    return result;
  },

  async getBloggersById(id: number): Promise<BloggersTypes | null> {
    return bloggersRepository.getBloggersById(id);
  },

  async deleteBloggerById(id: number): Promise<boolean> {
    return bloggersRepository.deleteBloggerById(id);
  },

  async createdBlogger(name: string, youtubeUrl: string): Promise<BloggersTypes> {
    const newBlogger = {
      id: +new Date(),
      name: name,
      youtubeUrl: youtubeUrl,
    };
    const creatededBlogger = await bloggersRepository.createdBlogger(newBlogger);
    return creatededBlogger;
  },

  async createdPostByBloggerId(
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: number,
  ): Promise<PostsType | null> {
    const blogger = await bloggersRepository.getBloggersById(bloggerId);
    if (blogger) {
      const newPost = {
        id: +new Date(),
        title: title,
        shortDescription: shortDescription,
        content: content,
        bloggerId: bloggerId,
        bloggerName: blogger.name,
      };
      const creatededPost = await postsRepository.createdPosts(newPost);
      return creatededPost;
    } else {
      return null;
    }
  },

  async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
    return bloggersRepository.updateBlogger(id, name, youtubeUrl);
  },
};
