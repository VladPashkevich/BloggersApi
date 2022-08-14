import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import { BloggersModel } from './db';
import { injectable } from 'inversify';
import { BloggersType } from '../types/bloggers-type';

interface BloggersData {
  bloggers: BloggersType[];
  totalCount: number;
}

@injectable()
export class BloggersRepository {
  async getBloggers(
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<BloggersData> {
    const bloggersFromDb = await BloggersModel.find({ name: { $regex: searchNameTerm } })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean();
    const totalCount = await BloggersModel.countDocuments({
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
  }

  async getBloggersById(id: ObjectId): Promise<BloggersType | null> {
    const blogger = await BloggersModel.findOne({ _id: id });
    if (blogger) {
      return {
        id: blogger._id,
        name: blogger.name,
        youtubeUrl: blogger.youtubeUrl,
      };
    }
    return null;
  }

  async deleteBloggerById(id: ObjectId): Promise<boolean> {
    const result = await BloggersModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
    //const bloggerInstance = await BloggersModelClass.findOne({ _id: id });
    //if (!bloggerInstance) return false;
    //await bloggerInstance.deleteOne();
    //return true;
  }

  async createdBlogger(newBlogger: BloggersType): Promise<boolean> {
    /*const bloggerInstance = new BloggersModelClass();
    bloggerInstance._id = newBlogger.id;
    bloggerInstance.name = newBlogger.name;
    bloggerInstance.youtubeUrl = newBlogger.youtubeUrl;*/
    const { id, ...rest } = newBlogger;
    const blogger = await BloggersModel.insertMany({ ...rest, _id: newBlogger.id });
    if (blogger) return true;
    return false;
    //const blogger = await bloggerInstance.save();
    //return newBlogger;
  }

  async updateBlogger(id: ObjectId, name: string, youtubeUrl: string): Promise<boolean> {
    const result = await BloggersModel.updateOne(
      { _id: id },
      { $set: { name: name, youtubeUrl: youtubeUrl } },
    );
    /*const bloggerInstance = await BloggersModelClass.findOne({ _id: id });
    if (!bloggerInstance) return false;
    bloggerInstance.name = name;
    bloggerInstance.youtubeUrl = youtubeUrl;
    await bloggerInstance.save();
    return true;*/
    return result.matchedCount === 1;
  }
}
