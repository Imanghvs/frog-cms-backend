import { CreateUserDTO } from '../dto/create-user.dto';

export interface IUsersService {
  create(data: CreateUserDTO): Promise<any>;
}
