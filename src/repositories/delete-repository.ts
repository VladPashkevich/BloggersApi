import {
  bloggersCollection,
  commentsCollection,
  ipCollections,
  postsCollection,
  usersCollection,
} from './db';

export const deleteRepository = {
  async deleteAlls(): Promise<boolean> {
    await usersCollection.deleteMany({});
    await bloggersCollection.deleteMany({});
    await commentsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    await ipCollections.deleteMany({});
    return true;
  },
};
