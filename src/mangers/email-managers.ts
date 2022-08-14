import { EmailAdapter } from '../adapters/email-adapter';
import { UserAccountDBType, UserAccountOnType } from '../types/users-type';
import { injectable } from 'inversify';

@injectable()
export class EmailManager {
  constructor(protected emailAdapter: EmailAdapter) {
    this.emailAdapter = emailAdapter;
  }

  async sendEmailConfirmationMessage(user: UserAccountDBType) {
    await this.emailAdapter.sendEmail(
      user.accountData.email,
      user.emailConfirmation.confirmationCode,
      'resending-code',
    );
  }
}
