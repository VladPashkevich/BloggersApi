import { ObjectId } from 'mongodb';
import { usersCollection } from './db';
import { UsersType, UsersTypeFromDB, UserType } from './types';

interface UsersData {
  users: UsersTypeFromDB[];
  totalCount: number;
}

export const usersRepository = {
  async getAllUsers(pageNumber: number, pageSize: number): Promise<UsersData> {
    const usersTypeFromDb = await usersCollection
      .find()
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .toArray();
    const totalCount = await usersCollection.countDocuments();
    let users = usersTypeFromDb.map((u) => ({
      id: u._id,
      login: u.login,
    }));
    return {
      users: users,
      totalCount: totalCount,
    };
  },
  async createNewUser(newUser: UsersType): Promise<boolean> {
    const { id, login, ...rest } = newUser;
    const user = await usersCollection.insertOne({
      ...rest,
      login: newUser.login,
      _id: newUser.id,
    });
    return user.acknowledged;
  },
  async deleteUserById(id: ObjectId): Promise<boolean> {
    let result = await usersCollection.deleteOne({ _id: id });
    return result.deletedCount === 1;
  },

  async getUserById(id: ObjectId): Promise<UsersTypeFromDB | null> {
    const user = await usersCollection.findOne({ _id: id });
    if (user) {
      return {
        id: user._id,
        login: user.login,
      };
    }
    return null;
  },
  async getUserByIdForAuth(id: ObjectId): Promise<UserType | null> {
    const user = await usersCollection.findOne({ _id: id });
    if (user) {
      return user;
    }
    return null;
  },
  async findByLogin(login: string): Promise<UserType | null> {
    const user = usersCollection.findOne({ login: login });
    if (user) {
      return user;
    }
    return null;
  },
};
