import { param } from 'express-validator';

export const paramBloggerIdValidator = param('bloggerId').isMongoId();
