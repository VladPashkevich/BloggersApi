import { bloggers, posts } from './database';

export const postsRepository = {
  getPosts() {
    return posts;
  },

  getPostsById(id: number) {
    const post = posts.find((b) => b.id === id);
    return post;
  },

  deletePostsById(id: number) {
    const index = posts.findIndex((v) => v.id === id);
    if (index !== -1) {
      posts.splice(index, 1);
      return true;
    } else {
      return false;
    }
  },

  createdPosts(title: string, shortDescription: string, content: string, bloggerId: number) {
    const blogger = bloggers.find((blogger) => bloggerId === blogger.id);
    if (blogger) {
      const post = {
        id: +new Date(),
        title: title,
        shortDescription: shortDescription,
        content: content,
        bloggerId: bloggerId,
        bloggerName: blogger.name,
      };
      posts.push(post);
      return post;
    } else {
      return null;
    }
  },

  updatePosts(
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: number,
  ) {
    const post = posts.find((p) => p.id === id);
    const blogger = bloggers.find((blogger) => bloggerId === blogger.id);
    if (post && blogger) {
      post.title = title;
      post.shortDescription = shortDescription;
      post.content = content;
      post.bloggerId = bloggerId;
      post.bloggerName = blogger.name;
      return post;
    } else {
      return null;
    }
  },
};
