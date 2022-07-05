import { body } from 'express-validator';

const commentsMaxLength = 300;
const commentsMinLength = 20;

export const contentCommentValidator = body('content')
  .trim()
  .notEmpty()
  .withMessage('Missing a required parametr')
  .isLength({ min: commentsMinLength, max: commentsMaxLength })
  .withMessage(`Title shoud be between ${commentsMinLength} and ${commentsMaxLength}`);
