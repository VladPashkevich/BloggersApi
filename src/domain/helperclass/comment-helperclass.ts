import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { CommentsRepository } from '../../repositories/comments-db-repository';
import { CommentsModel } from '../../repositories/db';
import {
  CommentDBType,
  CommentsPaginationType,
  CommentsResponseType,
  CommentsType,
  CommentType,
} from '../../types/comments-type';
import { LikeHelperClass } from './like-helperclass';

@injectable()
export class CommentsHelperClass {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected likeHelperClass: LikeHelperClass,
  ) {
    this.commentsRepository = commentsRepository;
    this.likeHelperClass = likeHelperClass;
  }

  /* async createComment(postid: ObjectId, content: string, userid: ObjectId, userLogin: string): Promise<NewCommentType | null> {
        const newComment: CommentsDBType = {
            _id: new ObjectId(),
            postid: postid,
            content,
            userId: userid,
            userLogin,
            addedAt: new Date()
        }
        const generatedComment: NewCommentType | null = await this.commentsRepositories.createComment(newComment)
        if (generatedComment !== null) {
            return this.createResponseComment(generatedComment)
        }
        return null
    } */

  async sendAllComments(
    postId: ObjectId,
    pagenumber: number,
    pagesize: number,
    userId: ObjectId,
  ): Promise<CommentsPaginationType> {
    let totalCount: number = await this.commentsRepository.commentsCount(postId);

    let page: number = pagenumber;
    let pageSize: number = pagesize;
    let pagesCount: number = Math.ceil(totalCount / pageSize);
    const itemsFromDb: CommentDBType[] = await CommentsModel.find({ postId: postId })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();

    const mapItems = async () => {
      return Promise.all(
        itemsFromDb.map(async (d) => ({
          id: d._id,
          content: d.content,
          userId: d.userId,
          userLogin: d.userLogin,
          addedAt: d.addedAt,
          likesInfo: {
            likesCount: await this.likeHelperClass.likesCount(d._id),
            dislikesCount: await this.likeHelperClass.dislikesCount(d._id),
            myStatus: await this.likeHelperClass.myStatus(userId, d._id),
          },
        })),
      );
    };

    let comment = {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: await mapItems(),
    };

    return comment;
  }

  /* async deleteCommentsByPost(id: ObjectId): Promise<boolean> {
        return await this.commentsRepositories.deleteCommentsByPost(id)
    } */

  async createResponseComment(
    comment: CommentType,
    userId?: ObjectId,
  ): Promise<CommentsResponseType | null> {
    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      addedAt: comment.addedAt,
      likesInfo: {
        likesCount: await this.likeHelperClass.likesCount(new ObjectId(comment.id)),
        dislikesCount: await this.likeHelperClass.dislikesCount(new ObjectId(comment.id)),
        myStatus: await this.likeHelperClass.myStatus(
          new ObjectId(userId),
          new ObjectId(comment.id),
        ),
      },
    };
  }

  async getResponseComment(
    comment: CommentsType,
    userId?: ObjectId,
  ): Promise<CommentsResponseType | null> {
    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      addedAt: comment.addedAt,
      likesInfo: {
        likesCount: await this.likeHelperClass.likesCount(new ObjectId(comment.id)),
        dislikesCount: await this.likeHelperClass.dislikesCount(new ObjectId(comment.id)),
        myStatus: await this.likeHelperClass.myStatus(
          new ObjectId(userId),
          new ObjectId(comment.id),
        ),
      },
    };
  }
}
