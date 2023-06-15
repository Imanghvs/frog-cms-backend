import { CreateUserDTO } from '../dto/create-user.dto';
import { UserEntity } from '../schemas/users.schema';

export interface IUsersRepository {
  save(data: CreateUserDTO): Promise<UserEntity>;
}
