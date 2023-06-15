import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserEntity } from '../schemas/users.schema';
import { CreateUserDTO } from '../dto/create-user.dto';
import { IUsersRepository } from './users.repository.interface';

export const defaultSort: Record<string, 1 | -1> = { createdAt: -1 };
@Injectable()
export class UsersRepository implements IUsersRepository {
  public readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(UserEntity.name) private UserModel: Model<UserDocument>,
  ) {}

  async save(data: CreateUserDTO): Promise<UserEntity> {
    return new this.UserModel(data).save();
  }
}
