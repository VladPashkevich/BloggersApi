import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { FilterQuery } from 'mongoose';
import { BloggersRepository } from '../../repositories/bloggers-db-repository';
import { PostsModel } from '../../repositories/db';
import { PostsRepository } from '../../repositories/posts-db-repository';
import {
  PostsDBType,
  PostsPaginationType,
  PostsResponseType,
  PostsType,
  PostsWithPaginationType,
} from '../../types/posts-type';
import { LikeHelperClass } from './like-helperclass';

@injectable()
export class PostsHelper {
  constructor(
    protected bloggersRepository: BloggersRepository,
    protected postsRepository: PostsRepository,
    protected likeHelperClass: LikeHelperClass,
  ) {
    this.bloggersRepository = bloggersRepository;
    this.postsRepository = postsRepository;
    this.likeHelperClass = likeHelperClass;
  }

  /* async makePost(title: string, shortDescription: string, content: string, bloggerId: ObjectId): Promise<PostsDBType | null> {
        const blogger: BloggerResponseType | null = await this.bloggersRepositories.findBloggersById(new ObjectId(bloggerId))
        if (blogger) {
            const newPost: PostsDBType = {
                _id: new ObjectId(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: new ObjectId(bloggerId),
                bloggerName: blogger.name,
                addedAt: new Date()
            }
            return newPost
        }
        return null
    } */

  async getPostsPagination(
    pageNumber: number,
    pagesize: number,
    userId: ObjectId,
    bloggerId?: ObjectId,
  ): Promise<PostsWithPaginationType> {
    const filterQuery: FilterQuery<PostsDBType> = {
      bloggerId,
    };

    let totalCount: number = await PostsModel.countDocuments(filterQuery);
    let page: number = pageNumber;
    let pageSize: number = pagesize;
    let pagesCount: number = Math.ceil(totalCount / pageSize);

    const itemsFromDb: PostsDBType[] = await PostsModel.find(filterQuery)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();
    const mapItems = async () => {
      return Promise.all(
        itemsFromDb.map(async (p) => ({
          id: p._id,
          title: p.title,
          shortDescription: p.shortDescription,
          content: p.content,
          bloggerId: p.bloggerId,
          bloggerName: p.bloggerName,
          addedAt: p.addedAt,
          extendedLikesInfo: {
            likesCount: await this.likeHelperClass.likesCount(p._id),
            dislikesCount: await this.likeHelperClass.dislikesCount(p._id),
            myStatus: await this.likeHelperClass.myStatus(userId, p._id),
            newestLikes: await this.likeHelperClass.newestLike(p._id),
          },
        })),
      );
    };

    let post = {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: await mapItems(),
    };

    return post;
  }

  async makePostResponse(post: PostsType, userId?: ObjectId): Promise<PostsResponseType> {
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      bloggerId: post.bloggerId,
      bloggerName: post.bloggerName,
      addedAt: post.addedAt,
      extendedLikesInfo: {
        likesCount: await this.likeHelperClass.likesCount(new ObjectId(post.id)),
        dislikesCount: await this.likeHelperClass.dislikesCount(new ObjectId(post.id)),
        myStatus: await this.likeHelperClass.myStatus(new ObjectId(userId), new ObjectId(post.id)),
        newestLikes: await this.likeHelperClass.newestLike(new ObjectId(post.id)),
      },
    };
  }
}
