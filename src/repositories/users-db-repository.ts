import { ObjectId } from 'mongodb';
import { UsersModel } from './db';
import { injectable } from 'inversify';
import {
  UserAccountDBType,
  UserAccountOnType,
  UserForMe,
  UsersTypeFromDB,
} from '../types/users-type';

interface UsersData {
  users: UsersTypeFromDB[];
  totalCount: number;
}

@injectable()
export class UsersRepository {
  async getAllUsers(pageNumber: number, pageSize: number): Promise<UsersData> {
    const usersTypeFromDb = await UsersModel.find()
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean();
    const totalCount = await UsersModel.countDocuments();
    let users = usersTypeFromDb.map((u) => ({
      id: u._id,
      login: u.accountData.login,
    }));

    return {
      users: users,
      totalCount: totalCount,
    };
  }

  async createNewUser(newUser: UserAccountDBType): Promise<boolean> {
    const { id, ...rest } = newUser;
    const user = await UsersModel.insertMany({
      ...rest,
      _id: newUser.id,
    });
    if (user) return true;
    return false;
  }

  async deleteUserById(id: ObjectId): Promise<boolean> {
    let result = await UsersModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async getUserById(id: ObjectId): Promise<UsersTypeFromDB | null> {
    const user = await UsersModel.findOne({ _id: id });
    if (user) {
      return {
        id: user._id,
        login: user.accountData.login,
      };
    }
    return null;
  }

  async getUserByIdToken(id: ObjectId): Promise<UserForMe | null> {
    const user = await UsersModel.findOne({ _id: id });
    if (user) {
      return {
        email: user.accountData.email,
        login: user.accountData.login,
        userId: user._id,
      };
    }
    return null;
  }

  async getUserByIdForAuth(id: ObjectId): Promise<UserAccountOnType | null> {
    const user = await UsersModel.findOne({ _id: id });
    if (user) {
      return user;
    }
    return null;
  }

  async findByLogin(login: string): Promise<UserAccountOnType | null> {
    const user = UsersModel.findOne({ 'accountData.login': login });
    if (user) {
      return user;
    }
    return null;
  }

  async findByConfirmationCode(emailConfirmationCode: string) {
    const user = await UsersModel.findOne({
      'emailConfirmation.confirmationCode': emailConfirmationCode,
    });
    return user;
  }

  async updateConfirmation(id: ObjectId) {
    let result = await UsersModel.updateOne(
      { _id: id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  }

  async findByEmail(email: string): Promise<UserAccountOnType | null> {
    const user = await UsersModel.findOne({ 'accountData.email': email });
    if (user) {
      return user;
    }
    return null;
  }

  async updateConfirmationCode(id: ObjectId, emailConfirmationCode: string) {
    let result = await UsersModel.updateOne(
      { _id: id },
      { $set: { 'emailConfirmation.confirmationCode': emailConfirmationCode } },
    );
    return result.modifiedCount === 1;
  }
}
