import { LoginDTO } from '../dto';

export interface IAuthService {
  login(data: LoginDTO): Promise<{ accessToken: string }>;
}
