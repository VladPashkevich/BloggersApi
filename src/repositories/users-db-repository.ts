import { ObjectId } from 'mongodb';
import { usersCollection } from './db';
import {
  UserAccountDBType,
  UserAccountOnType,
  UsersType,
  UsersTypeFromDB,
  UserType,
} from './types';

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

    console.log(usersTypeFromDb);
    const totalCount = await usersCollection.countDocuments();
    let users = usersTypeFromDb.map((u) => ({
      id: u._id,
      login: u.accountData.login,
    }));

    return {
      users: users,
      totalCount: totalCount,
    };
  },
  async createNewUser(newUser: UserAccountDBType): Promise<boolean> {
    const { id, ...rest } = newUser;
    const user = await usersCollection.insertOne({
      ...rest,
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
        login: user.accountData.login,
      };
    }
    return null;
  },
  async getUserByIdForAuth(id: ObjectId): Promise<UserAccountOnType | null> {
    const user = await usersCollection.findOne({ _id: id });
    if (user) {
      return user;
    }
    return null;
  },
  async findByLogin(login: string): Promise<UserAccountOnType | null> {
    const user = usersCollection.findOne({ 'accountData.login': login });
    if (user) {
      return user;
    }
    return null;
  },

  async findByConfirmationCode(emailConfirmationCode: string) {
    const user = await usersCollection.findOne({
      'emailConfirmation.confirmationCode': emailConfirmationCode,
    });
    return user;
  },

  async updateConfirmation(id: ObjectId) {
    let result = await usersCollection.updateOne(
      { _id: id },
      { $set: { 'user.emailConfirmation.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  },
  async findByEmail(email: string): Promise<UserAccountOnType | null> {
    const user = await usersCollection.findOne({ 'accountData.email': email });
    if (user) {
      return user;
    }
    return null;
  },

  async updateConfirmationCode(id: ObjectId, emailConfirmationCode: string) {
    let result = await usersCollection.updateOne(
      { _id: id },
      { $set: { 'emailConfirmation.confirmationCode': emailConfirmationCode } },
    );
    return result.modifiedCount === 1;
  },
};
