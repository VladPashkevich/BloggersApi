import { MongoClient } from 'mongodb';
import { settings } from '../settings';
import { BloggersType, CommentsType, PostsType, UsersType } from './types';

const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017';

export const client = new MongoClient(settings.MONGO_URI);

let db = client.db('youtube');

export const postsCollection = db.collection<Omit<PostsType, 'id'>>('posts');
export const bloggersCollection = db.collection<Omit<BloggersType, 'id'>>('bloggers');
export const usersCollection = db.collection<Omit<UsersType, 'id'>>('users');
export const commentsCollection = db.collection<CommentsType>('comments');

export async function runDb() {
  try {
    console.log(settings.MONGO_URI);
    // Connect the client to the server
    await client.connect();
    console.log('Connected successfully to mongo server');
  } catch (e) {
    console.log("Can't connect to db");
    console.log(e);
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
