import { ObjectId } from 'mongodb';

export type CreateUserResponse = {
  id: ObjectId;
  username: string;
};
