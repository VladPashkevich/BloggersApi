import { param } from 'express-validator';

export const paramBloggerIDValidator = param('bloggerId').isMongoId();

export const paramPostIDValidator = param('postId').isMongoId();
