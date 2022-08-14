import { DeleteRepository } from '../repositories/delete-repository';
import { injectable } from 'inversify';

@injectable()
export class DeleteService {
  constructor(protected deleteRepository: DeleteRepository) {
    this.deleteRepository = deleteRepository;
  }
  async deleteUsers(): Promise<boolean> {
    return this.deleteRepository.deleteAlls();
  }
}
