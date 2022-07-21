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
      const result: any = jwt.verify(token, settings.JWT_SECRET, (error) => {
        if (error) return null;
      });
      return new ObjectId(result.userId);
    } catch (error) {
      return null;
    }
  },
};
