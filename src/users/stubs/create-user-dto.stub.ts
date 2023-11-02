import { CreateUserDTO } from '../dto/create-user.dto';
import { commonRawPassword, commonUsername } from './common.stub';

export const createUserDTOStub: CreateUserDTO = {
  username: commonUsername,
  password: commonRawPassword,
};
