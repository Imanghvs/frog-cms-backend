import { CreateUserDTO } from '../dto/create-user.dto';
import { StoredUser } from '../types/stored-user.types';

export interface IUsersRepository {
  save(data: CreateUserDTO): Promise<StoredUser>;
  getByUsername(username: string): Promise<StoredUser | null>;
}
