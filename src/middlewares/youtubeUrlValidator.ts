import { body } from 'express-validator';

const urlMaxLength = 100;
const urlRegexp = new RegExp('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$');

export const youtubeUrlValidator = body('youtubeUrl')
  .exists()
  .trim()
  .notEmpty()
  .withMessage('Missing a required parametr')
  .isLength({ max: urlMaxLength })
  .withMessage(`Length should be less then ${urlMaxLength}`)
  .matches(urlRegexp)
  .withMessage('Invalid Url addres');
