import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { IPModel } from '../repositories/db';

export class Mistake429 {
  async mistake429(req: Request, res: Response, next: NextFunction) {
    const point = req.method + req.originalUrl;
    const ip = req.ip;
    console.log(ip);

    const newCrud = {
      point: point,
      ip: ip,
      data: new Date(),
    };
    await IPModel.insertMany({ ...newCrud, _id: new ObjectId() });
    const fromData = new Date();
    fromData.setSeconds(fromData.getSeconds() - 10);
    const totalCount = await IPModel.countDocuments({
      point: point,
      ip: ip,
      data: { $gt: fromData },
    });

    if (totalCount > 5) {
      res.sendStatus(429);
      return;
    } else {
      next();
    }
  }
}

export const mistakes429 = new Mistake429();
