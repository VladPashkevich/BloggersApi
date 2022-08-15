import { Request, Response } from 'express';
import { DeleteService } from '../domain/delete-service';
import { injectable } from 'inversify';

@injectable()
export class DeleteController {
  constructor(protected deleteService: DeleteService) {
    this.deleteService = deleteService;
  }

  async deleteAllDatabase(req: Request, res: Response) {
    await this.deleteService.deleteUsers();

    res.sendStatus(200);
  }
}
