import { Request, Response, Router } from 'express';
import { deleteService } from '../domain/delete-service';

export const deleteRouter = Router({});

deleteRouter.delete('/all-data', async (req: Request, res: Response) => {
  await deleteService.deleteUsers();

  res.sendStatus(204);
});
