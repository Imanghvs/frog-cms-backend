import { Types as MongooseTypes } from 'mongoose';

export type StoredUser = {
  _id: MongooseTypes.ObjectId;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};
