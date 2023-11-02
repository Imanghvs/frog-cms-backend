/* eslint-disable class-methods-use-this */
import * as bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { CreateUserResponse } from '../types/create-user-response.type';
import { IUsersService } from './users.service.interface';
import { CreateUserDTO } from '../dto';
import { StoredUser } from '../types/stored-user.types';
import { commonRawPassword } from '../stubs/common.stub';

export class MockUsersService implements IUsersService {
  create(data: CreateUserDTO): Promise<CreateUserResponse> {
    return Promise.resolve({ id: new ObjectId('648e077686593bbbf08dd934'), username: data.username });
  }

  async getUserByUsername(username: string): Promise<StoredUser | null> {
    return Promise.resolve({
      _id: new ObjectId('648e077686593bbbf08dd934'),
      username,
      password: await bcrypt.hash(commonRawPassword, '$2a$10$W7gJK5i.AgJtuI/zIW1jh.'),
    } as StoredUser);
  }
}
