import { ObjectId, WithId } from 'mongodb';
import { Schema } from 'mongoose';

export type LikeDBType = {
  id: ObjectId;
  postId: ObjectId;
  status: string;
  addedAt: Date;
  userId: ObjectId;
  login: string;
};

export type ExtendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: Array<{
    addedAt: Date;
    userId: string;
    login: string;
  }>;
};

export type NewestLikes = {
  addedAt: Date;
  userId: ObjectId;
  login: string;
};

export const LikesSchema = new Schema<LikeDBType>({
  id: ObjectId,
  postId: ObjectId,
  status: String,
  addedAt: Date,
  userId: ObjectId,
  login: String,
});
