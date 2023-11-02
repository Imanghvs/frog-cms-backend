import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IUsersService } from './users.service.interface';
import { CreateUserDTO } from '../dto/create-user.dto';
import { IUsersRepository } from '../repository/users.repository.interface';
import { CreateUserResponse } from '../types/create-user-response.type';
import { StoredUser } from '../types/stored-user.types';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject('IUsersRepository') protected repository: IUsersRepository,
  ) {}

  async create(data: CreateUserDTO): Promise<CreateUserResponse> {
    const createdUser = await this.repository.save({
      ...data,
      password: await bcrypt.hash(data.password, await bcrypt.genSalt()),
    });
    return { id: createdUser._id, username: createdUser.username };
  }

  async getUserByUsername(username: string): Promise<StoredUser | null> {
    return this.repository.getByUsername(username);
  }
}
