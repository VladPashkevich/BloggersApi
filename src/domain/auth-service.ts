import bcrypt from 'bcrypt';
import { emailManager } from '../mangers/email-managers';
import { UserAccountDBType } from '../repositories/types';
import { usersRepository } from '../repositories/users-db-repository';
import { usersService } from './users-service';
import { v4 as uuidv4 } from 'uuid';

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

  async confirmEmail(code: string): Promise<boolean> {
    let user = await usersRepository.findByConfirmationCode(code);
    if (!user) return false;
    if (user.emailConfirmation.confirmationCode !== code) return false;

    if (user.emailConfirmation.expirationDate < new Date()) return false;
    let result = await usersRepository.updateConfirmation(user._id);
    return result;
  },

  async confirmEmailResending(email: string): Promise<boolean> {
    let user = await usersRepository.findByEmail(email);
    if (!user) return false;
    const code = uuidv4();
    const { _id, ...rest } = user;
    const newUser = { id: _id, ...rest };
    await usersRepository.updateConfirmationCode(user._id, code);
    await emailManager.sendEmailConfirmationMessage(newUser);
    return true;
  },
};
