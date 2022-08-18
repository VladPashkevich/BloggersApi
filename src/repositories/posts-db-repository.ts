import { ObjectId } from 'mongodb';
import { posts } from './database';
import { BloggersModel, PostsModel } from './db';
import { injectable } from 'inversify';
import { PostsDBType, PostsType } from '../types/posts-type';

interface PostsData {
  posts: PostsType[];
  totalCount: number;
}
@injectable()
export class PostsRepository {
  async getPosts(pageNumber: number, pageSize: number): Promise<PostsData> {
    const postsFromDB = await PostsModel.find({})
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean();
    const totalCount = await PostsModel.countDocuments();
    let posts = postsFromDB.map((p) => ({
      id: p._id,
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      bloggerId: p.bloggerId,
      bloggerName: p.bloggerName,
      addedAt: p.addedAt,
    }));
    return {
      posts: posts,
      totalCount: totalCount,
    };
  }

  async getPostsByBloggerId(
    bloggerId: ObjectId,
    pageNumber: number,
    pageSize: number,
  ): Promise<PostsData> {
    const postsFromDbBlogger = await PostsModel.find({ bloggerId: bloggerId })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean();
    const totalCount = await PostsModel.countDocuments({ bloggerId: bloggerId });
    let posts = postsFromDbBlogger.map((p) => ({
      id: p._id,
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      bloggerId: p.bloggerId,
      bloggerName: p.bloggerName,
      addedAt: p.addedAt,
    }));
    return {
      posts: posts,
      totalCount: totalCount,
    };
  }

  /* async createLikeOrDislike(newlike: PostsLikes): Promise<boolean> {
    const { id, ...rest } = newlike;
    const like = await PostLikeModel.insertMany({ ...rest, _id: newlike.id });
    if (like) return true;
    return false;
  }

  async findLikeByPostID(postId: ObjectId): Promise<PostsLikes | null> {
    const like = await PostLikeModel.findOne({ postId: postId });
    if (like) return like;
    return null;
  } */

  /*  async updateLikeByPostID(postId: ObjectId, likesStatus: string): Promise<boolean> {
    const like = await PostLikeModel.findOne({ postId: postId });
    if (like) {
      const result = await PostLikeModel.updateOne(
        { postId: postId },
        {
          $set: {
            likesStatus: likesStatus,
          },
        },
      );
      return result.matchedCount === 1;
    } else {
      return false;
    }
  } */

  async getPostsById(id: ObjectId): Promise<PostsType | null> {
    const post = await PostsModel.findOne({ _id: id });
    if (post) {
      return {
        id: post._id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        bloggerId: post.bloggerId,
        bloggerName: post.bloggerName,
        addedAt: post.addedAt,
      };
    }
    return null;
  }

  async deletePostsById(id: ObjectId): Promise<boolean> {
    const result = await PostsModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async createdPosts(newPost: PostsType): Promise<PostsType | null> {
    const { id, ...rest } = newPost;
    const posts = await PostsModel.insertMany({ ...rest, _id: newPost.id });
    if (posts) return newPost;
    return null;
  }

  async updatePosts(
    id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
  ): Promise<boolean | undefined> {
    const blogger = await BloggersModel.findOne({ _id: bloggerId });
    if (blogger) {
      const result = await PostsModel.updateOne(
        { _id: id },
        {
          $set: {
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: blogger.name,
          },
        },
      );
      return result.matchedCount === 1;
    } else {
      return false;
    }
  }
}
