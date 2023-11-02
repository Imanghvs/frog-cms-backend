/* eslint-disable class-methods-use-this */
import * as bcrypt from 'bcryptjs';
import { Types as MongooseTypes } from 'mongoose';
import { CreateUserDTO } from '../dto/create-user.dto';
import { IUsersRepository } from './users.repository.interface';
import { StoredUser } from '../types/stored-user.types';

export class MockUsersRepository implements IUsersRepository {
  save(data: CreateUserDTO): Promise<StoredUser> {
    return Promise.resolve({
      ...data,
      _id: new MongooseTypes.ObjectId('648e077686593bbbf08dd934'),
      createdAt: '2023-06-17T19:22:15.494Z',
      updatedAt: '2023-06-17T19:22:15.494Z',
      __v: 0,
    });
  }

  async getByUsername(username: string): Promise<StoredUser | null> {
    return {
      username,
      password: await bcrypt.hash('Qwer@1234', '$2a$10$W7gJK5i.AgJtuI/zIW1jh.'),
      _id: new MongooseTypes.ObjectId('648e077686593bbbf08dd934'),
      createdAt: '2023-06-17T19:22:15.494Z',
      updatedAt: '2023-06-17T19:22:15.494Z',
      __v: 0,
    };
  }
}
