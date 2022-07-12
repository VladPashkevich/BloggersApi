import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import {
  UserAccountDBType,
  UserAccountOnType,
  UsersDBType,
  UsersType,
  UsersTypeFromDB,
  UserType,
} from '../repositories/types';
import { usersRepository } from '../repositories/users-db-repository';
import { emailAdapter } from '../adapters/email-adapter';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';

export const usersService = {
  async getAllUsers(pageNumber: number, pageSize: number): Promise<UsersDBType> {
    const { users, totalCount } = await usersRepository.getAllUsers(pageNumber, pageSize);
    const result: UsersDBType = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: users,
    };
    return result;
  },
  async createdNewUser(
    login: string,
    email: string,
    password: string,
  ): Promise<UserAccountDBType | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser: UserAccountDBType = {
      id: new ObjectId(),
      accountData: {
        login: login,
        email: email,
        passwordHash,
        passwordSalt,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 24,
        }),
        isConfirmed: false,
      },
    };
    const createdUser = await usersRepository.createNewUser(newUser);
    if (createdUser) {
      return newUser;
    } else {
      return null;
    }
  },
  async deleteUserById(id: ObjectId): Promise<boolean> {
    return usersRepository.deleteUserById(id);
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
  async getUserById(id: ObjectId): Promise<UsersTypeFromDB | null> {
    return usersRepository.getUserById(id);
  },
  async getUserByIdForAuth(_id: ObjectId): Promise<UserAccountOnType | null> {
    return usersRepository.getUserByIdForAuth(_id);
  },
  async checkCredentials(user: UserAccountOnType, login: string, password: string) {
    const passwordHash = await this._generateHash(password, user.accountData.passwordSalt);
    if (user.accountData.passwordHash !== passwordHash) {
      return false;
    }
    return true;
  },
  async getUserByLogIn(login: string): Promise<UserAccountOnType | null> {
    return usersRepository.findByLogin(login);
  },
  async findUserByEmail(email: string): Promise<UserAccountOnType | null> {
    return usersRepository.findByEmail(email);
  },

  async updateConfirmationCode(id: ObjectId, emailConfirmationCode: string): Promise<boolean> {
    return usersRepository.updateConfirmationCode(id, emailConfirmationCode);
  },
};
