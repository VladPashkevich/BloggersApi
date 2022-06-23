import { bloggers } from './database';

export const bloggersRepository = {
  getBloggers() {
    return bloggers;
  },

  getBloggersById(id: number) {
    const blogger = bloggers.find((b) => b.id === id);
    return blogger;
  },

  deleteBloggerById(id: number) {
    const index = bloggers.findIndex((v) => v.id === id);
    if (index !== -1) {
      bloggers.splice(index, 1);
      return true;
    } else {
      return false;
    }
  },

  createdBlogger(name: string, youtubeUrl: string) {
    const newBlogger = {
      id: Math.floor(Math.random() * 2147483647),
      name: name,
      youtubeUrl: youtubeUrl,
    };
    bloggers.push(newBlogger);
    return newBlogger;
  },

  updateBlogger(id: number, name: string, youtubeUrl: string) {
    const blogger = bloggers.find((v) => v.id === id);

    if (blogger) {
      blogger.name = name;
      blogger.youtubeUrl = youtubeUrl;
      return blogger;
    } else {
      return null;
    }
  },
};
