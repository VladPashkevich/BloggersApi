import { Request, Response, Router } from 'express';
import { EmailAdapter } from '../adapters/email-adapter';
import { injectable } from 'inversify';

@injectable()
export class EmailController {
  constructor(protected emailAdapter: EmailAdapter) {
    this.emailAdapter = emailAdapter;
  }

  async sendEmail(req: Request, res: Response) {
    await this.emailAdapter.sendEmail(req.body.email, req.body.text, req.body.subject);
  }
}
