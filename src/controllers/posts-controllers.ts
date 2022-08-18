import 'reflect-metadata';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { PostsService } from '../domain/posts-service';
import { injectable } from 'inversify';
import { CommentsService } from '../domain/comments-service';

@injectable()
export class PostsController {
  constructor(protected postsService: PostsService, protected commentsService: CommentsService) {
    this.postsService = postsService;
    this.commentsService = commentsService;
  }

  async getAllPosts(req: Request, res: Response) {
    const userId = new ObjectId(req.user?._id);
    const pageNumber = Number(req.query.PageNumber) || 1;
    const pageSize = Number(req.query.PageSize) || 10;
    const allPosts = await this.postsService.findPosts(pageNumber, pageSize, userId);
    res.status(200).send(allPosts);
  }

  async getCommentsByPostID(req: Request, res: Response) {
    const userId = new ObjectId(req.user?._id);
    const pageNumber = Number(req.query.PageNumber) || 1;
    const pageSize = Number(req.query.PageSize) || 10;
    const postId = new ObjectId(req.params.postId);
    const allPosts = await this.postsService.sendAllCommentsByPostId(
      postId,
      pageNumber,
      pageSize,
      userId,
    );

    res.status(200).send(allPosts);
  }

  /* async createPostLike(req: Request, res: Response) {
    const like = req.query.like;
  } */

  async createPost(req: Request, res: Response) {
    const post = await this.postsService.createdPosts(
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      new ObjectId(req.body.bloggerId),
    );
    if (post) {
      res.status(201).send(post);
    } else {
      res.status(400).send({
        errorsMessages: [
          {
            message: 'Invalid value',
            field: 'bloggerId',
          },
        ],
      });
    }
  }

  async createCommentByPostID(req: Request, res: Response) {
    const postId = new ObjectId(req.params.postId);
    const post = await this.postsService.getPostsById(postId);
    if (!post) {
      res.send(404);
      return;
    }
    const comment = await this.commentsService.createComment(
      req.body.content,
      req.user!._id,
      req.user!.accountData.login,
      postId,
    );
    if (comment) {
      res.status(201).send(comment);
    } else {
      res.send(404);
    }
  }

  async updatePost(req: Request, res: Response) {
    const postId = new ObjectId(req.params.postId);
    const post = await this.postsService.getPostsById(postId);
    if (!post) {
      return res.send(404);
    }
    const updatePost = await this.postsService.updatePosts(
      postId,
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      new ObjectId(req.body.bloggerId),
    );
    if (updatePost) {
      res.status(204).send(updatePost);
    } else {
      res.status(400).send({
        errorsMessages: [
          {
            message: 'Invalid value',
            field: 'bloggerId',
          },
        ],
      });
    }
  }

  async getPostByID(req: Request, res: Response) {
    const userId = new ObjectId(req.user?._id);
    const post = await this.postsService.findPostById(new ObjectId(req.params.postId), userId);
    if (post) {
      res.status(200).send(post);
    } else {
      res.send(404);
    }
  }

  async deletePost(req: Request, res: Response) {
    const isDelete = await this.postsService.deletePostsById(new ObjectId(req.params.postId));

    if (isDelete) {
      res.send(204);
    } else {
      res.sendStatus(404);
    }
  }

  async updateLikeStatus(req: Request, res: Response) {
    const isUpdated = await this.postsService.updateLikeStatus(
      req.body.likeStatus,
      new ObjectId(req.params.postId),
      new ObjectId(req.user!._id),
      req.user!.accountData.login,
    );
    if (isUpdated) {
      res.sendStatus(204);
      return;
    }

    res.sendStatus(404);
  }
}
