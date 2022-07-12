import { deleteRepository } from '../repositories/delete-repository';

export const deleteService = {
  async deleteUsers(): Promise<boolean> {
    return deleteRepository.deleteAllUsers();
  },

  async deleteBloggers(): Promise<boolean> {
    return deleteRepository.deleteAllBloggers();
  },

  async deletePosts(): Promise<boolean> {
    return deleteRepository.deleteAllPosts();
  },

  async deleteComments(): Promise<boolean> {
    return deleteRepository.deleteAllComments();
  },
  async deleteIp(): Promise<boolean> {
    return deleteRepository.deleteAllIp();
  },
};
