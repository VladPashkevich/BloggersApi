import { UserAccountOnType, UsersType, UserType } from '../repositories/types';
import jwt from 'jsonwebtoken';
import { settings } from '../settings';
import { ObjectId } from 'mongodb';
import { tokenCollections } from '../repositories/db';

export const jwtService = {
  async createJWT(user: UserAccountOnType) {
    const token = jwt.sign({ userId: user._id }, settings.JWT_SECRET, { expiresIn: '10s' });
    return token;
  },

  async createJWTRefresh(user: UserAccountOnType) {
    const tokenRefresh = jwt.sign({ userId: user._id }, settings.JWT_SECRET, {
      expiresIn: '20s',
    });
    await tokenCollections.insertOne({
      _id: new ObjectId(),
      refreshToken: tokenRefresh,
      userId: user._id,
    });
    return tokenRefresh;
  },

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return new ObjectId(result.userId);
    } catch (error) {
      return null;
    }
  },

  async refreshTokenFind(token: string): Promise<boolean> {
    let refreshTokenFind = await tokenCollections.findOne({ refreshToken: token });
    if (refreshTokenFind === null) return false;
    let refreshTokenTimeOut = await jwtService.getUserIdByToken(token);
    if (refreshTokenTimeOut === null) {
      return false;
    } else {
      return true;
    }
  },
  async refreshTokenKill(token: string): Promise<boolean> {
    let result = await tokenCollections.findOne({ refreshToken: token });
    if (result === null) {
      return false;
    } else {
      return true;
    }
  },
};
