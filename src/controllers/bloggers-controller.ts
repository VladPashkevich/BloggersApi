import { Request, Response } from 'express';
import { BloggersService } from '../domain/bloggers-service';
import { ObjectId } from 'mongodb';
import { injectable } from 'inversify';

@injectable()
export class BloggersController {
  constructor(protected bloggersService: BloggersService) {}

  async getAllBloggers(req: Request, res: Response) {
    const searchNameTerm = (req.query.SearchNameTerm as string) || '';
    const pageNumber = Number(req.query.PageNumber) || 1;
    const pageSize = Number(req.query.PageSize) || 10;
    const allBloggers = await this.bloggersService.getBloggers(
      pageNumber,
      pageSize,
      searchNameTerm,
    );
    res.send(allBloggers);
  }

  async getBloggerByID(req: Request, res: Response) {
    const blogger = await this.bloggersService.getBloggersById(new ObjectId(req.params.bloggerId));
    if (blogger) {
      res.send(blogger);
    } else {
      res.send(404);
    }
  }

  async getPostByBloggerID(req: Request, res: Response) {
    const blogger = await this.bloggersService.getBloggersById(new ObjectId(req.params.bloggerId));
    if (!blogger) {
      return res.send(404);
    }
    const userId = new ObjectId(req.user.id);
    const pageNumber = Number(req.query.PageNumber) || 1;
    const pageSize = Number(req.query.PageSize) || 10;
    const allPostsOfBlogger = await this.bloggersService.getPostsByBloggerId(
      new ObjectId(req.params.bloggerId),
      pageNumber,
      pageSize,
      userId,
    );
    res.status(200).send(allPostsOfBlogger);
  }

  async createBlogger(req: Request, res: Response) {
    const newBlogger = await this.bloggersService.createdBlogger(
      req.body.name,
      req.body.youtubeUrl,
    );
    res.status(201).send(newBlogger);
  }

  async createPostByBloggerID(req: Request, res: Response) {
    const blogger = await this.bloggersService.getBloggersById(new ObjectId(req.params.bloggerId));
    if (!blogger) {
      return res.send(404);
    }
    const post = await this.bloggersService.createdPostByBloggerId(
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      new ObjectId(req.params.bloggerId),
    );
    if (post) {
      res.status(201).send(post);
    } else {
      res.send(404);
    }
  }

  async updateBlogger(req: Request, res: Response) {
    const blogerId = new ObjectId(req.params.bloggerId);
    const blogger = await this.bloggersService.getBloggersById(blogerId);
    if (!blogger) {
      return res.send(404);
    }
    const updateBlogger = await this.bloggersService.updateBlogger(
      blogerId,
      req.body.name,
      req.body.youtubeUrl,
    );

    if (updateBlogger) {
      res.sendStatus(204);
    } else {
      res.send(404);
    }
  }

  async deleteBloggerByID(req: Request, res: Response) {
    const isDelete = await this.bloggersService.deleteBloggerById(
      new ObjectId(req.params.bloggerId),
    );
    if (isDelete) {
      res.send(204);
    } else {
      res.sendStatus(404);
    }
  }
}
