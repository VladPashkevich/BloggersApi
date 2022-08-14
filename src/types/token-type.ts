import { ObjectId, WithId } from 'mongodb';
import { Schema } from 'mongoose';

export type TokenType = WithId<{
  refreshToken: string;
  userId: ObjectId;
}>;

export const TokenSchema = new Schema<TokenType>({
  refreshToken: String,
  userId: ObjectId,
});
