import { param } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

export const mongoIdValidator =
  (param: string) => async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params?.[param];
    console.log(req.params);
    console.log(id);
    try {
      new ObjectId(id);
      next();
    } catch (e) {
      res.send(404);
    }
  };
