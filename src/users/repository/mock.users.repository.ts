/* eslint-disable class-methods-use-this */
import { ObjectId } from 'mongodb';
import { CreateUserDTO } from '../dto/create-user.dto';
import { IUsersRepository } from './users.repository.interface';

export class MockUsersRepository implements IUsersRepository {
  // @ts-ignore
  save(data: CreateUserDTO) {
    return Promise.resolve({
      ...data,
      _id: new ObjectId('648e077686593bbbf08dd934'),
      createdAt: new Date('2023-06-17T19:22:15.494Z'),
      updatedAt: new Date('2023-06-17T19:22:15.494Z'),
      __v: 0,
    });
  }
}
