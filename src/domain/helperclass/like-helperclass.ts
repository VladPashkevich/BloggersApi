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

  async likesCount(id: ObjectId): Promise<number> {
    return this.likesRepository.countLike(id);
  }

  async dislikesCount(id: ObjectId): Promise<number> {
    return this.likesRepository.countDislike(id);
  }

  async myStatus(id: ObjectId, post: ObjectId): Promise<string> {
    return this.likesRepository.myStatus(id, post);
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
