import { body } from 'express-validator';

const shortDescriptionMaxLength = 100;

export const shortDescriptionValidator = body('shortDescription')
  .trim()
  .notEmpty()
  .withMessage('Missing a required parametr')
  .isLength({ max: shortDescriptionMaxLength })
  .withMessage(`Title shoud be less then ${shortDescriptionMaxLength}`);
