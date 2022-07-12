import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { ipCollections } from '../repositories/db';

export const mistake429 = async (req: Request, res: Response, next: NextFunction) => {
  const point = req.method + req.originalUrl;
  const ip = req.ip;

  const newCrud = {
    point: point,
    ip: ip,
    data: new Date(),
  };
  await ipCollections.insertOne({ ...newCrud, _id: new ObjectId() });
  const fromData = new Date();
  fromData.setSeconds(fromData.getSeconds() - 10);
  const totalCount = await ipCollections.countDocuments({
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
};
