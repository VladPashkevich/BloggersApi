import bcrypt from 'bcrypt';
import { emailManager } from '../mangers/email-managers';
import { UserAccountDBType, UserForMe } from '../repositories/types';
import { usersRepository } from '../repositories/users-db-repository';
import { usersService } from './users-service';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { isConfirmedValidator } from '../middlewares/isConfirmedMiddleware';
import { ObjectId } from 'mongodb';

export const authService = {
  async generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  },

  async createUser(login: string, email: string, password: string) {
    const newUser = await usersService.createdNewUser(login, email, password);
    if (!newUser) return null;
    await emailManager.sendEmailConfirmationMessage(newUser);
    return newUser;
  },

  async confirmCode(code: string): Promise<boolean> {
    let user = await usersRepository.findByConfirmationCode(code);
    if (!user) return false;
    if (user.emailConfirmation.confirmationCode !== code) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;
    let result = await usersRepository.updateConfirmation(user._id);
    return result;
  },

  async confirmEmailResending(email: string): Promise<boolean> {
    let user = await usersRepository.findByEmail(email);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    const code = uuidv4();
    const { _id, emailConfirmation, ...rest } = user;
    const newUser = {
      id: _id,
      ...rest,
      emailConfirmation: {
        isConfirmed: true,
        confirmationCode: code,
        expirationDate: add(new Date(), {
          hours: 24,
        }),
      },
    };
    await usersRepository.updateConfirmationCode(user._id, code);
    await emailManager.sendEmailConfirmationMessage(newUser);
    return true;
  },
};
