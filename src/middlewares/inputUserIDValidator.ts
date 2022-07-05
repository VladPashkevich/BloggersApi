import { param } from 'express-validator';

export const paramUserIDValidator = param('userId').isMongoId();
