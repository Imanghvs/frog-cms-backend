/* eslint-disable class-methods-use-this */
import { Inject, Injectable } from '@nestjs/common';
import { IUsersService } from './users.service.interface';
import { CreateUserDTO } from '../dto/create-user.dto';
import { IUsersRepository } from '../repository/users.repository.interface';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject('IUsersRepository') protected repository: IUsersRepository,
  ) {}

  create(data: CreateUserDTO): Promise<any> {
    return this.repository.save(data);
  }
}
