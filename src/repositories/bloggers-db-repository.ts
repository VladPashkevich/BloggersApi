import { ObjectId } from 'mongodb';
import { bloggersCollection } from './db';
import { BloggersTypes } from './types';

interface BloggersData {
  bloggers: BloggersTypes[];
  totalCount: number;
}

export const bloggersRepository = {
  async getBloggers(
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<BloggersData> {
    const bloggers = await bloggersCollection
      .find({ name: { $regex: searchNameTerm } })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .toArray();
    const totalCount = await bloggersCollection.countDocuments();
    return {
      bloggers: bloggers,
      totalCount: totalCount,
    };
  },

  async getBloggersById(id: number): Promise<BloggersTypes | null> {
    const blogger = await bloggersCollection.findOne({ id: id });
    return blogger;
  },

  async deleteBloggerById(id: number): Promise<boolean> {
    const result = await bloggersCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },

  async createdBlogger(newBlogger: BloggersTypes): Promise<BloggersTypes> {
    await bloggersCollection.insertOne({ ...newBlogger, _id: new ObjectId() });
    return newBlogger;
  },

  async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
    const result = await bloggersCollection.updateOne(
      { id: id },
      { $set: { name: name, youtubeUrl: youtubeUrl } },
    );
    return result.matchedCount === 1;
  },
};
