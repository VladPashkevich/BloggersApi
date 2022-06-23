import { WithId } from 'mongodb';

export type BloggersTypeWithId = WithId<BloggersTypes>;

export type BloggersTypes = {
  id: number;
  name: string;
  youtubeUrl: string;
};

export type PostsTypeWithId = WithId<PostsType>;

export type PostsType = {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: number;
  bloggerName: string;
};

export type BloggersDBType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BloggersTypes[];
};

export type PostsDBType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsType[];
};
