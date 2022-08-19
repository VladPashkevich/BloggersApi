import {
  BloggersModel,
  CommentsModel,
  IPModel,
  LikesModel,
  PostsModel,
  TokenModel,
  UsersModel,
} from './db';
import { injectable } from 'inversify';

@injectable()
export class DeleteRepository {
  async deleteAlls(): Promise<boolean> {
    await UsersModel.deleteMany({});
    await BloggersModel.deleteMany({});
    await CommentsModel.deleteMany({});
    await PostsModel.deleteMany({});
    await IPModel.deleteMany({});
    await LikesModel.deleteMany({});
    await TokenModel.deleteMany({});
    return true;
  }
}
