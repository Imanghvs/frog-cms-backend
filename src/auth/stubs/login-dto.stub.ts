import { LoginDTO } from '../dto';
import { commonRawPassword, commonUsername } from './common.stub';

export const loginDTOStub: LoginDTO = {
  username: commonUsername,
  password: commonRawPassword,
};
