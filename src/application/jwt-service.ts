import 'reflect-metadata';
import { UserAccountOnType } from '../types/users-type';
import jwt from 'jsonwebtoken';
import { settings } from '../settings';
import { ObjectId } from 'mongodb';
import { TokenModel } from '../repositories/db';
import { injectable } from 'inversify';

@injectable()
export class JWTService {
  async createJWT(user: UserAccountOnType) {
    const token = jwt.sign({ userId: user._id }, settings.JWT_SECRET, { expiresIn: '12h' });
    return token;
  }

  async createJWTRefresh(user: UserAccountOnType) {
    const tokenRefresh = jwt.sign({ userId: user._id }, settings.JWT_SECRET, {
      expiresIn: '24h',
    });
    await TokenModel.insertMany({
      _id: new ObjectId(),
      refreshToken: tokenRefresh,
      userId: user._id,
    });
    return tokenRefresh;
  }

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return new ObjectId(result.userId);
    } catch (error) {
      return null;
    }
  }

  async refreshTokenFind(token: string): Promise<boolean> {
    let refreshTokenFind = await TokenModel.findOne({ refreshToken: token });
    if (refreshTokenFind === null) return false;
    let refreshTokenTimeOut = await this.getUserIdByToken(token);
    if (refreshTokenTimeOut === null) {
      return false;
    } else {
      return true;
    }
  }

  async refreshTokenKill(token: string): Promise<boolean> {
    let result = await this.refreshTokenKillIn(token);
    if (result === false) {
      return false;
    } else {
      return true;
    }
  }

  async refreshTokenKillIn(token: string): Promise<boolean> {
    const result = await TokenModel.deleteOne({ refreshToken: token });
    return result.deletedCount === 1;
  }
}
