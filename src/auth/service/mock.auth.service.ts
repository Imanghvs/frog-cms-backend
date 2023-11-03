/* eslint-disable class-methods-use-this */
import { IAuthService } from './auth.service.interface';

export class MockAuthService implements IAuthService {
  login(): Promise<{ accessToken: string }> {
    return Promise.resolve({ accessToken: 'sample-token' });
  }
}
