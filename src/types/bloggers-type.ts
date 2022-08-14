import { ObjectId, WithId } from 'mongodb';
import { Schema } from 'mongoose';

export type BloggersDbType = {
  _id: ObjectId;
  name: string;
  youtubeUrl: string;
};

export class BloggersClass {
  constructor(public id: ObjectId, public name: string, public youtubeUrl: string) {}
}
export type BloggersPaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BloggersType[];
};

export type BloggersType = {
  id: ObjectId;
  name: string;
  youtubeUrl: string;
};

export const BloggersSchema = new Schema<BloggersType>({
  id: ObjectId,
  name: String,
  youtubeUrl: String,
});
