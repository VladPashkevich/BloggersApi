import bcrypt from 'bcrypt';
import { EmailManager } from '../mangers/email-managers';
import { UsersRepository } from '../repositories/users-db-repository';
import { UsersService } from './users-service';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { isConfirmedValidator } from '../middlewares/isConfirmedMiddleware';
import { ObjectId } from 'mongodb';
import { injectable } from 'inversify';

@injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected usersService: UsersService,
    protected emailManager: EmailManager,
  ) {
    this.usersRepository = usersRepository;
    this.usersService = usersService;
    this.emailManager = emailManager;
  }

  async generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async createUser(login: string, email: string, password: string) {
    const newUser = await this.usersService.createdNewUser(login, email, password);
    if (!newUser) return null;
    await this.emailManager.sendEmailConfirmationMessage(newUser);
    return newUser;
  }

  async confirmCode(code: string): Promise<boolean> {
    let user = await this.usersRepository.findByConfirmationCode(code);
    if (!user) return false;
    if (user.emailConfirmation.confirmationCode !== code) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;
    let result = await this.usersRepository.updateConfirmation(user._id);
    return result;
  }

  async confirmEmailResending(email: string): Promise<boolean> {
    let user = await this.usersRepository.findByEmail(email);
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
    await this.usersRepository.updateConfirmationCode(user._id, code);
    await this.emailManager.sendEmailConfirmationMessage(newUser);
    return true;
  }
}
