/* eslint-disable class-methods-use-this */
import { Inject, Injectable } from '@nestjs/common';
import { IUsersService } from './users.service.interface';
import { CreateUserDTO } from '../dto/create-user.dto';
import { IUsersRepository } from '../repository/users.repository.interface';
import { IBcryptWraper } from './bcrypt/bcrypt-wrapper.interface';
import { IUsersConfig } from '../config/users.config.interface';
import { CreateUserResponse } from '../types/create-user-response.type';
import { StoredUser } from '../types/stored-user.types';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject('IUsersRepository') protected repository: IUsersRepository,
    @Inject('IBcryptWrapper') protected bcryptWrapper: IBcryptWraper,
    @Inject('IUsersConfig') protected config: IUsersConfig,
  ) {}

  async create(data: CreateUserDTO): Promise<CreateUserResponse> {
    const createdUser = await this.repository.save({
      ...data,
      password: await this.bcryptWrapper.hash(data.password, this.config.salt),
    });
    return { id: createdUser._id, username: createdUser.username };
  }

  async getUserByUsername(username: string): Promise<StoredUser | null> {
    return this.repository.getByUsername(username);
  }
}
