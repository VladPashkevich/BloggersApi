import { Request, Response, Router } from 'express';
import { EmailController } from '../controllers/email-controller';
import { container } from '../root/composition-root';

export const emailRouter = Router({});

const emailController = container.resolve(EmailController);

/*emailRouter.post('/send', async (req: Request, res: Response) => {
  await emailAdapter.sendEmail(req.body.email, req.body.text, req.body.subject);
});*/

emailRouter.post('/send', emailController.sendEmail.bind(emailController));
