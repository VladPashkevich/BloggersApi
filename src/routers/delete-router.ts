import { Request, Response, Router } from 'express';
import { DeleteController } from '../controllers/delete-controller';
import { container } from '../root/composition-root';

export const deleteRouter = Router({});

const deleteController = container.resolve(DeleteController);

/*deleteRouter.delete('/all-data', async (req: Request, res: Response) => {
  await deleteService.deleteUsers();
  res.sendStatus(204);
});*/

deleteRouter.delete('/all-data', deleteController.deleteAllDatabase.bind(deleteController));
