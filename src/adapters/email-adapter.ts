import nodemailer from 'nodemailer';
import { injectable } from 'inversify';

@injectable()
export class EmailAdapter {
  async sendEmail(email: string, code: string, subject: string) {
    let transport = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      port: 465,
      auth: {
        user: 'vladpashkevichforteaching@gmail.com',
        pass: 'pyqibrvunwxbnbry',
      },
    });

    // send mail with defined transport object
    let info = await transport.sendMail({
      from: 'Vlad <vladpashkevichforteaching@gmail.com>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: `https://some-front.com/confirm-registration?code=${code}`,
    });
    console.log(info);
  }
}
