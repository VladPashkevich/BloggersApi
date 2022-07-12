import { deleteRepository } from '../repositories/delete-repository';

export const deleteService = {
  async deleteUsers(): Promise<boolean> {
    return deleteRepository.deleteAlls();
  },
};
