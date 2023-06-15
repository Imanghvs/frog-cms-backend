/* eslint-disable class-methods-use-this */
import { CreateUserDTO } from '../dto/create-user.dto';
import { IUsersRepository } from './users.repository.interface';

export class MockUsersRepository implements IUsersRepository {
  save(data: CreateUserDTO) { return Promise.resolve(data); }
}
