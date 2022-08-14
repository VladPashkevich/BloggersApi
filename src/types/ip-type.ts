import { ObjectId, WithId } from 'mongodb';
import { Schema } from 'mongoose';

export type IPType = {
  ip: string;
  point: string;
  data: Date;
};

export const IPSchema = new Schema<IPType>({
  ip: String,
  point: String,
  data: Date,
});
