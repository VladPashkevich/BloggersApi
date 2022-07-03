import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { UsersDBType, UsersType, UsersTypeFromDB, UserType } from '../repositories/types';
import { usersRepository } from '../repositories/users-db-repository';

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
  async createdNewUser(login: string, password: string): Promise<UsersTypeFromDB | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser: UsersType = {
      id: new ObjectId(),
      login: login,
      passwordHash,
      passwordSalt,
    };
    const createdUser = await usersRepository.createNewUser(newUser);
    if (createdUser) {
      return { id: newUser.id, login: newUser.login };
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
  async getUserByIdForAuth(_id: ObjectId): Promise<UserType | null> {
    return usersRepository.getUserByIdForAuth(_id);
  },
  async checkCredentials(user: UserType, login: string, password: string) {
    const passwordHash = await this._generateHash(password, user.passwordSalt);
    if (user.passwordHash !== passwordHash) {
      return false;
    }
    return true;
  },
  async getUserByLogIn(login: string): Promise<UserType | null> {
    return usersRepository.findByLogin(login);
  },
};
