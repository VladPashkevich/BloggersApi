import { ObjectId, WithId } from 'mongodb';
import { Schema } from 'mongoose';

export type UserAccountDBType = {
  id: ObjectId;
  accountData: UserAccountType;
  emailConfirmation: EmailConfirmationType;
};

export class UserAccountClass {
  constructor(
    public _id: ObjectId,
    public accountData: {
      email: string;
      login: string;
      passwordHash: string;
      passwordSalt: string;
      createdAt: Date;
    },
    public emailConfirmation: {
      isConfirmed: boolean;
      confirmationCode: string;
      expirationDate: Date;
    },
  ) {}
}

export type UserForMe = {
  email: string;
  login: string;
  userId: ObjectId;
};

export type UserAccountOnType = {
  _id: ObjectId;
  accountData: UserAccountType;
  emailConfirmation: EmailConfirmationType;
};

export type EmailConfirmationType = {
  isConfirmed: boolean;
  confirmationCode: string;
  expirationDate: Date;
};

export type UserAccountType = {
  email: string;
  login: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
};

export const UsersSchema = new Schema<UserAccountOnType>({
  _id: ObjectId,
  accountData: {
    email: String,
    login: String,
    passwordHash: String,
    passwordSalt: String,
    createdAt: Date,
  },
  emailConfirmation: {
    isConfirmed: Boolean,
    confirmationCode: String,
    expirationDate: Date,
  },
});

export type UsersTypeFromDB = {
  id: ObjectId;
  login: string;
};

export type UsersDBType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UsersTypeFromDB[];
};
