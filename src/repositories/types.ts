import { ObjectId, WithId } from 'mongodb';

export type BloggersTypeWithId = WithId<BloggersType>;

export type BloggersType = {
  id: ObjectId;
  name: string;
  youtubeUrl: string;
};

export type PostsTypeWithId = WithId<PostsType>;

export type UsersType = {
  id: ObjectId;
  login: string;
  passwordHash: string;
  passwordSalt: string;
};

export type UserType = {
  _id: ObjectId;
  login: string;
  passwordHash: string;
  passwordSalt: string;
};

export type PostsType = {
  id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: ObjectId;
  bloggerName: string;
};

export type BloggersDBType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BloggersType[];
};

export type PostsDBType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsType[];
};

export type UsersTypeFromDB = {
  id: ObjectId;
  login: string;
};

export type UsersDBType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UsersTypeFromDB[];
};

export type CommentsType = {
  id: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  addeAt: Date;
  postId: ObjectId;
};
export type CommentType = {
  id: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  addeAt: Date;
};

export type CommentsDBType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentType[];
};
