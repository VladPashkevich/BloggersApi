import { ObjectId, WithId } from 'mongodb';
import { Schema } from 'mongoose';

export type CommentType = {
  id: ObjectId;
  postId: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  addedAt: Date;
};

export type CommentDBType = {
  _id: ObjectId;
  postId: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  addedAt: Date;
};

export type CommentsType = {
  id: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  addedAt: Date;
};

export type CommentsResponseType = {
  id: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  addedAt: Date;
  likesInfo: LikesInfo;
};

export type LikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
};

export type CommentsPaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentsResponseType[];
};

export const CommentsSchema = new Schema<CommentDBType>({
  _id: ObjectId,
  content: String,
  userId: ObjectId,
  userLogin: String,
  addedAt: Date,
  postId: ObjectId,
});

/*export class CommentsClass {
  constructor(
    public id: ObjectId,
    public content: string,
    public userId: ObjectId,
    public userLogin: string,
    public addedAt: Date,
    public postId: ObjectId,
  ) {}
}*/

//export type CommentDto = Omit<CommentType, 'postId'>;

/*class CommentsMapper {
  static fromSchemaToDto(s: CommentsType): CommentDto {
    return {
      id: s.id,
      content: s.content,
      userId: s.userId,
      userLogin: s.userLogin,
      addedAt: s.addedAt,
    };
  }
}*/
