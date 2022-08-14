import { ObjectId, WithId } from 'mongodb';
import { Schema } from 'mongoose';

export type PostsPaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsType[];
};

export type PostsWithPaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsResponseType[];
};

export type PostsDBType = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: ObjectId;
  bloggerName: string;
  addedAt: Date;
};

export type PostsType = {
  id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: ObjectId;
  bloggerName: string;
  addedAt: Date;
};

export type PostsResponseType = {
  id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: ObjectId;
  bloggerName: string;
  addedAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: Array<{
      addedAt: Date;
      userId: ObjectId;
      login: string;
    }>;
  };
};

export type ExtendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLikes[];
};

export type NewestLikes = {
  addedAt: Date;
  userId: ObjectId;
  login: string;
};

export class PostsClass {
  constructor(
    public id: ObjectId,
    public title: string,
    public shortDescription: string,
    public content: string,
    public bloggerId: ObjectId,
    public bloggerName: string,
    public addedAt: Date,
    public extendedLikesInfo: {
      likesCount: Number;
      dislikesCount: Number;
      myStatus: String;
      newestLikes: [
        {
          addedAt: Date;
          userId: String;
          login: String;
        },
      ];
    },
  ) {}
}

export const PostsSchema = new Schema<PostsDBType>({
  _id: ObjectId,
  title: String,
  shortDescription: String,
  content: String,
  bloggerId: ObjectId,
  bloggerName: String,
  addedAt: Date,
});
