import { ObjectId, WithId } from 'mongodb';

export type TokenType = WithId<{
  refreshToken: string;
  userId: ObjectId;
}>;

export type UserForMe = {
  email: string;
  login: string;
  userId: ObjectId;
};

export type BloggersTypeWithId = WithId<BloggersType>;

export type BloggersType = {
  id: ObjectId;
  name: string;
  youtubeUrl: string;
};

export type PostsTypeWithId = WithId<PostsType>;

export type UserAccountDBType = {
  id: ObjectId;
  accountData: UserAccountType;
  emailConfirmation: EmailConfirmationType;
};
export type UserAccountOnType = {
  _id: ObjectId;
  accountData: UserAccountType;
  emailConfirmation: EmailConfirmationType;
};

export type EmailConfirmationType = {
  isConfirmed: boolean;
  confirmationCode: string;
  expirationDate: Date;
};

export type UserAccountType = {
  email: string;
  login: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
};

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
  addedAt: Date;
  postId: ObjectId;
};
export type CommentType = {
  id: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  addedAt: Date;
};

export type CommentsDBType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentType[];
};
export type IPType = {
  ip: string;
  point: string;
  data: Date;
};
