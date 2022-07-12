import { emailAdapter } from '../adapters/email-adapter';
import { UserAccountDBType, UserAccountOnType } from '../repositories/types';

export const emailManager = {
  async sendEmailConfirmationMessage(user: UserAccountDBType) {
    await emailAdapter.sendEmail(
      user.accountData.email,
      user.emailConfirmation.confirmationCode,
      'resending-code',
    );
  },

  async sendEmailConfirmationMessage2(user: UserAccountOnType) {
    await emailAdapter.sendEmail(
      user.accountData.email,
      user.emailConfirmation.confirmationCode,
      'resending-code',
    );
  },
};
