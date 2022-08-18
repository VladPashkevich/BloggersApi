import 'reflect-metadata';
import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { LikeDBType, LikeType, NewestLikes } from '../types/likes-type';
import { LikesModel } from './db';

@injectable()
export class LikesRepository {
  async createLike(like: LikeDBType): Promise<boolean> {
    const { id, ...rest } = like;
    const likes = await LikesModel.insertMany({
      ...rest,
      _id: like.id,
    });
    if (likes) return true;
    return false;
  }

  async countLike(postid: ObjectId): Promise<number> {
    return LikesModel.countDocuments({ postid, status: 'Like' });
  }

  async countDislike(postid: ObjectId): Promise<number> {
    return LikesModel.countDocuments({ postid, status: 'Dislike' });
  }

  async myStatus(userId: ObjectId, postid?: ObjectId): Promise<string> {
    const status: LikeType | null = await LikesModel.findOne({ $and: [{ postid }, { userId }] });
    if (status) {
      return status.status;
    }
    return 'None';
  }

  async newestLike(postid: ObjectId): Promise<NewestLikes[]> {
    const like = await LikesModel.find({ $and: [{ postid }, { status: 'Like' }] })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
    return like.map((l) => ({ addedAt: l.addedAt, userId: l.userId, login: l.login }));
  }

  async findLike(post: ObjectId, userId: ObjectId, status: string): Promise<LikeDBType | boolean> {
    const like = await LikesModel.findOne({ $and: [{ post }, { userId }] });
    if (!like) return false;
    await LikesModel.updateOne({ post: post, userId: userId }, { $set: { status: status } });
    return like;
  }
}
