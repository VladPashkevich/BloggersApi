import 'reflect-metadata';
import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { LikeDBType, NewestLikes } from '../types/likes-type';
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

  async countLike(postId: ObjectId): Promise<number> {
    return LikesModel.countDocuments({ postId, status: 'Like' });
  }

  async countDislike(postId: ObjectId): Promise<number> {
    return LikesModel.countDocuments({ postId, status: 'Dislike' });
  }

  async myStatus(userId: ObjectId, postId: ObjectId): Promise<string> {
    const status: LikeDBType | null = await LikesModel.findOne({ $and: [{ postId }, { userId }] });
    if (status) {
      return status.status;
    }
    return 'None';
  }

  async newestLike(postId: ObjectId): Promise<NewestLikes[]> {
    const like = await LikesModel.find({ $and: [{ postId }, { status: 'Like' }] })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
    return like.map((l) => ({ addedAt: l.addedAt, userId: l.userId, login: l.login }));
  }

  async findLike(
    postId: ObjectId,
    userId: ObjectId,
    status: string,
  ): Promise<LikeDBType | boolean> {
    const like = await LikesModel.findOne({ $and: [{ postId }, { userId }] });
    if (!like) return false;
    await LikesModel.updateOne({ postId: postId, userId: userId }, { $set: { status: status } });
    return like;
  }
}
