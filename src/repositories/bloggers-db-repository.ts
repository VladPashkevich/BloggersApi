import { ObjectId } from 'mongodb';
import { bloggersCollection } from './db';
import { BloggersType } from './types';

interface BloggersData {
  bloggers: BloggersType[];
  totalCount: number;
}

export const bloggersRepository = {
  async getBloggers(
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<BloggersData> {
    const bloggersFromDb = await bloggersCollection
      .find({ name: { $regex: searchNameTerm } })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .toArray();
    const totalCount = await bloggersCollection.countDocuments({
      name: { $regex: searchNameTerm },
    });
    let bloggers = bloggersFromDb.map((b) => ({
      id: b._id,
      name: b.name,
      youtubeUrl: b.youtubeUrl,
    }));
    return {
      bloggers: bloggers,
      totalCount: totalCount,
    };
  },

  async getBloggersById(id: ObjectId): Promise<BloggersType | null> {
    const blogger = await bloggersCollection.findOne({ _id: id });
    if (blogger) {
      return {
        id: blogger._id,
        name: blogger.name,
        youtubeUrl: blogger.youtubeUrl,
      };
    }
    return null;
  },

  async deleteBloggerById(id: ObjectId): Promise<boolean> {
    const result = await bloggersCollection.deleteOne({ _id: id });
    return result.deletedCount === 1;
  },

  async createdBlogger(newBlogger: BloggersType): Promise<boolean> {
    const { id, ...rest } = newBlogger;
    const blogger = await bloggersCollection.insertOne({ ...rest, _id: newBlogger.id });
    return blogger.acknowledged;
  },

  async updateBlogger(id: ObjectId, name: string, youtubeUrl: string): Promise<boolean> {
    const result = await bloggersCollection.updateOne(
      { _id: id },
      { $set: { name: name, youtubeUrl: youtubeUrl } },
    );
    return result.matchedCount === 1;
  },
};
