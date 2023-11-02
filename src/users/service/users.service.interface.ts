import { CreateUserDTO } from '../dto/create-user.dto';
import { CreateUserResponse } from '../types/create-user-response.type';
import { StoredUser } from '../types/stored-user.types';

export interface IUsersService {
  create(data: CreateUserDTO): Promise<CreateUserResponse>;
  getUserByUsername(username: string): Promise<StoredUser | null>;
}
