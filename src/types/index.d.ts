import { UsersType } from '../repositories/types';

declare global {
  declare namespace Express {
    export interface Request {
      user: UserType | null;
    }
  }
}
