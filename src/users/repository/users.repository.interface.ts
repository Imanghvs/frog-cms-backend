import { CreateUserDTO } from '../dto/create-user.dto';
import { UserDocument } from '../schemas/users.schema';

export interface IUsersRepository {
  save(data: CreateUserDTO): Promise<UserDocument>;
}
