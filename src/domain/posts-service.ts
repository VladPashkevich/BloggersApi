import { bloggersRepository } from '../repositories/bloggers-db-repository';
import { postsRepository } from '../repositories/posts-db-repository';
import { PostsDBType, PostsType } from '../repositories/types';

export const postsService = {
  async getPosts(pageNumber: number, pageSize: number): Promise<PostsDBType> {
    const { posts, totalCount } = await postsRepository.getPosts(pageNumber, pageSize);
    const result: PostsDBType = {
      pagesCount: Math.ceil(posts.length / 10),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: posts,
    };

    return result;
  },

  async getPostsById(id: number): Promise<PostsType | null> {
    return postsRepository.getPostsById(id);
  },

  async deletePostsById(id: number): Promise<boolean> {
    return postsRepository.deletePostsById(id);
  },

  async createdPosts(
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

  async updatePosts(
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: number,
  ): Promise<boolean | undefined> {
    return postsRepository.updatePosts(id, title, shortDescription, content, bloggerId);
  },
};
