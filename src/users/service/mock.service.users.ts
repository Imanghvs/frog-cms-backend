/* eslint-disable class-methods-use-this */
import { CreateUserDTO } from '../dto/create-user.dto';
import { IUsersService } from './users.service.interface';

export class MockUsersService implements IUsersService {
  create(data: CreateUserDTO): Promise<any> {
    return Promise.resolve(data);
  }
}
