import { MongoClient } from 'mongodb';
import { settings } from '../settings';
import { IPSchema } from '../types/ip-type';
import mongoose from 'mongoose';
import { BloggersSchema } from '../types/bloggers-type';
import { PostsSchema } from '../types/posts-type';
import { CommentsSchema } from '../types/comments-type';
import { LikesSchema } from '../types/likes-type';
import { UsersSchema } from '../types/users-type';
import { TokenSchema } from '../types/token-type';

const mongoUri = settings.MONGO_URI || 'mongodb://0.0.0.0:27017';
let dbName = process.env.mongoDBName || 'youtube';
//export const client = new MongoClient(settings.MONGO_URI);

//let db = client.db('youtube');

//export const postsCollection = db.collection<Omit<PostsType, 'id'>>('posts');
//export const bloggersCollection = db.collection<Omit<BloggersType, 'id'>>('bloggers');
//export const usersCollection = db.collection<Omit<UserAccountDBType, 'id'>>('users');
//export const commentsCollection = db.collection<Omit<CommentsType, 'id'>>('comments');
//export const ipCollections = db.collection<IPType>('ip');
//export const tokenCollections = db.collection<TokenType>('token');
export const BloggersModel = mongoose.model('bloggers', BloggersSchema);
export const PostsModel = mongoose.model('posts', PostsSchema);
export const CommentsModel = mongoose.model('comments', CommentsSchema);
export const IPModel = mongoose.model('ip', IPSchema);
export const TokenModel = mongoose.model('token', TokenSchema);
export const UsersModel = mongoose.model('users', UsersSchema);
//export const CommentsLikesModel = moongoosee.model('commentslikes', )
export const LikesModel = mongoose.model('likes', LikesSchema);

export async function runDb() {
  try {
    console.log(settings.MONGO_URI);
    // Connect the client to the server
    //await client.connect();
    await mongoose.connect(mongoUri + '/' + dbName);
    console.log(mongoUri, 'MongoUri');
    console.log('Connected successfully to mongo server');
  } catch (e) {
    console.log("Can't connect to db");
    console.log(e);
    // Ensures that the client will close when you finish/error
    //await client.close();
    await mongoose.disconnect();
  }
}
