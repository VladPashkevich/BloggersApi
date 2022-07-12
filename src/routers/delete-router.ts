import { Request, Response, Router } from 'express';
import { deleteService } from '../domain/delete-service';

export const deleteRouter = Router({});

deleteRouter.delete('/users', async (req: Request, res: Response) => {
  const isUsersDelete = await deleteService.deleteUsers();
  if (isUsersDelete) {
    res.sendStatus(204);
  }
});

deleteRouter.delete('/bloggers', async (req: Request, res: Response) => {
  const isBloggersDelete = await deleteService.deleteBloggers();
  if (isBloggersDelete) {
    res.sendStatus(204);
  }
});

deleteRouter.delete('/posts', async (req: Request, res: Response) => {
  const isPostsDelete = await deleteService.deletePosts();
  if (isPostsDelete) {
    res.sendStatus(204);
  }
});

deleteRouter.delete('/comments', async (req: Request, res: Response) => {
  const isCommentsDelete = await deleteService.deletePosts();
  if (isCommentsDelete) {
    res.sendStatus(204);
  }
});

deleteRouter.delete('/ip', async (req: Request, res: Response) => {
  const isIpDelete = await deleteService.deletePosts();
  if (isIpDelete) {
    res.sendStatus(204);
  }
});
