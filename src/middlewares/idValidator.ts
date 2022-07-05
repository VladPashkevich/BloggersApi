import { param } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

export const mongoIdValidator =
  (param: string) => async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params?.[param];
    console.log(req.params);
    console.log(id);
    if (isValidObjectID(id)) {
      next();
    } else {
      res.send(404);
    }
  };
function isValidObjectID(str: string) {
  str = str + '';
  var len = str.length,
    valid = false;
  if (len == 12 || len == 24) {
    valid = /^[0-9a-fA-F]+$/.test(str);
  }
  return valid;
}
export const paramBloggerIDValidator = param('bloggerId').isMongoId();

export const paramPostIDValidator = param('postId').isMongoId();
