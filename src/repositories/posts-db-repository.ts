import { ObjectId } from 'mongodb';
import { posts } from './database';
import { bloggersCollection, postsCollection } from './db';
import { CommentsType, PostsType } from './types';

interface PostsData {
  posts: PostsType[];
  totalCount: number;
}

export const postsRepository = {
  async getPosts(pageNumber: number, pageSize: number): Promise<PostsData> {
    const postsFromDB = await postsCollection
      .find({})
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .toArray();
    const totalCount = await postsCollection.countDocuments();
    let posts = postsFromDB.map((p) => ({
      id: p._id,
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      bloggerId: p.bloggerId,
      bloggerName: p.bloggerName,
    }));
    return {
      posts: posts,
      totalCount: totalCount,
    };
  },

  async getPostsByBloggerId(
    bloggerId: ObjectId,
    pageNumber: number,
    pageSize: number,
  ): Promise<PostsData> {
    const postsFromDbBlogger = await postsCollection
      .find({ bloggerId: bloggerId })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .toArray();
    const totalCount = await postsCollection.countDocuments({ bloggerId: bloggerId });
    let posts = postsFromDbBlogger.map((p) => ({
      id: p._id,
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      bloggerId: p.bloggerId,
      bloggerName: p.bloggerName,
    }));
    return {
      posts: posts,
      totalCount: totalCount,
    };
  },

  async getPostsById(id: ObjectId): Promise<PostsType | null> {
    const post = await postsCollection.findOne({ _id: id });
    if (post) {
      return {
        id: post._id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        bloggerId: post.bloggerId,
        bloggerName: post.bloggerName,
      };
    }
    return null;
  },

  async deletePostsById(id: ObjectId): Promise<boolean> {
    const result = await postsCollection.deleteOne({ _id: id });
    return result.deletedCount === 1;
  },

  async createdPosts(newPost: PostsType): Promise<boolean> {
    const { id, ...rest } = newPost;
    const posts = await postsCollection.insertOne({ ...rest, _id: newPost.id });
    return posts.acknowledged;
  },

  async updatePosts(
    id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
  ): Promise<boolean | undefined> {
    const blogger = await bloggersCollection.findOne({ _id: bloggerId });
    if (blogger) {
      const result = await postsCollection.updateOne(
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
  },
};
