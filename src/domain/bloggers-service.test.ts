/*import 'reflect-metadata';
import { BloggersRepository } from '../repositories/bloggers-db-repository';
import { PostsRepository } from '../repositories/posts-db-repository';
import { BloggersService } from './bloggers-service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('integration test for usersservice', async () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  const bloggersRepository = new BloggersRepository();
  const postsRepository = new PostsRepository();
  const bloggersService = new BloggersService(bloggersRepository, postsRepository);

  describe('createBlogger', () => {
    it('should return', async () => {
      let name = 'vlad';*/
//let youtubeUrl = 'https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$';
/*const result = await bloggersService.createdBlogger(name, youtubeUrl);

      expect(result?.name).toBe(name);
      expect(result?.youtubeUrl).toBe(youtubeUrl);
    });
  });
});*/
