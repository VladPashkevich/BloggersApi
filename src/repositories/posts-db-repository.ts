import { ObjectId } from 'mongodb';
import { bloggersCollection, postsCollection } from './db';
import { PostsType } from './types';

interface PostsData {
  posts: PostsType[];
  totalCount: number;
}

export const postsRepository = {
  async getPosts(pageNumber: number, pageSize: number): Promise<PostsData> {
    const posts = await postsCollection
      .find({}, { projection: { _id: 0 } })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .toArray();
    const totalCount = await postsCollection.countDocuments();
    return {
      posts: posts,
      totalCount: totalCount,
    };
  },

  async getPostsByBloggerId(
    bloggerId: number,
    pageNumber: number,
    pageSize: number,
  ): Promise<PostsData> {
    const posts = await postsCollection
      .find({ bloggerId: bloggerId }, { projection: { _id: 0 } })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .toArray();
    const totalCount = await postsCollection.countDocuments({ bloggerId: bloggerId });
    return {
      posts: posts,
      totalCount: totalCount,
    };
  },

  async getPostsById(id: number): Promise<PostsType | null> {
    const post = await postsCollection.findOne({ id: id }, { projection: { _id: 0 } });
    return post;
  },

  async deletePostsById(id: number): Promise<boolean> {
    const result = await postsCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },

  async createdPosts(newPost: PostsType): Promise<PostsType | null> {
    await postsCollection.insertOne({ ...newPost, _id: new ObjectId() });
    return newPost;
  },

  async updatePosts(
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: number,
  ): Promise<boolean | undefined> {
    const blogger = await bloggersCollection.findOne({ id: bloggerId });
    if (blogger) {
      const result = await postsCollection.updateOne(
        { id: id },
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
