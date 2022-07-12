import {
  bloggersCollection,
  commentsCollection,
  ipCollections,
  postsCollection,
  usersCollection,
} from './db';

export const deleteRepository = {
  async deleteAllUsers(): Promise<boolean> {
    const result = await usersCollection.deleteMany({});
    return result.deletedCount === 1;
  },

  async deleteAllBloggers(): Promise<boolean> {
    const result = await bloggersCollection.deleteMany({});
    return result.deletedCount === 1;
  },

  async deleteAllPosts(): Promise<boolean> {
    const result = await postsCollection.deleteMany({});
    return result.deletedCount === 1;
  },

  async deleteAllComments(): Promise<boolean> {
    const result = await commentsCollection.deleteMany({});
    return result.deletedCount === 1;
  },

  async deleteAllIp(): Promise<boolean> {
    const result = await ipCollections.deleteMany({});
    return result.deletedCount === 1;
  },
};
