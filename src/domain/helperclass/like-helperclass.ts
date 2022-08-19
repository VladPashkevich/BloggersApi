import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { LikesRepository } from '../../repositories/likes-repository';
import { LikeDBType } from '../../types/likes-type';
import { NewestLikes } from '../../types/posts-type';

@injectable()
export class LikeHelperClass {
  constructor(protected likesRepository: LikesRepository) {
    this.likesRepository = likesRepository;
  }

  async likesCount(postid: ObjectId): Promise<number> {
    return this.likesRepository.countLike(postid);
  }

  async dislikesCount(postid: ObjectId): Promise<number> {
    return this.likesRepository.countDislike(postid);
  }

  async myStatus(id: ObjectId, postid: ObjectId): Promise<string> {
    return this.likesRepository.myStatus(id, postid);
  }

  async newestLike(id: ObjectId): Promise<NewestLikes[]> {
    return this.likesRepository.newestLike(id);
  }

  async createLike(likeStatus: string, postid: ObjectId, userId: ObjectId, login: string) {
    const alreadyLiked: LikeDBType | boolean = await this.likesRepository.findLike(
      postid,
      userId,
      likeStatus,
    );
    if (alreadyLiked) {
      return alreadyLiked;
    }

    const like: LikeDBType = {
      id: new ObjectId(),
      postid: postid,
      status: likeStatus,
      addedAt: new Date(),
      userId: userId,
      login: login,
    };

    return this.likesRepository.createLike(like);
  }
}
