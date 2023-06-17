/* eslint-disable class-methods-use-this */
import { Inject, Injectable } from '@nestjs/common';
import { IUsersService } from './users.service.interface';
import { CreateUserDTO } from '../dto/create-user.dto';
import { IUsersRepository } from '../repository/users.repository.interface';
import { IBcryptWraper } from './bcrypt/bcrypt-wrapper.interface';
import { IUsersConfig } from '../config/users.config.interface';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject('IUsersRepository') protected repository: IUsersRepository,
    @Inject('IBcryptWrapper') protected bcryptWrapper: IBcryptWraper,
    @Inject('IUsersConfig') protected config: IUsersConfig,
  ) {}

  async create(data: CreateUserDTO): Promise<any> {
    return this.repository.save({
      ...data,
      password: await this.bcryptWrapper.hash(data.password, this.config.salt),
    });
  }
}
