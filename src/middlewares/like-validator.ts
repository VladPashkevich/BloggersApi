import { body, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
/* let status = ['None', 'Like', 'Dislike'];
export const likeStatusValidation = body('likeStatus').isIn(status); */
export const likeStatusValidation = body('likeStatus').isString().withMessage('Should be String');

/* export const inputValidationLikeStatus = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let newError = errors.array();
    res.status(400).json({
      errorsMessages: newError.map((er) => ({
        message: er.msg,
        field: er.param,
      })),
    });
    return;
  }
  next();
}; */

export const likeOrDislakeValidation = (req: Request, res: Response, next: NextFunction) => {
  const likeStatus = req.body.likeStatus;
  if (likeStatus !== 'Dislike' && likeStatus !== 'Like' && likeStatus !== 'None') {
    res
      .status(400)
      .send({ errorsMessages: [{ message: 'Should be Like or Dislike', field: 'likeStatus' }] });
    return;
  }
  next();
};
