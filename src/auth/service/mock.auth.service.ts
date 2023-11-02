/* eslint-disable class-methods-use-this */
import { IAuthService } from './auth.service.interface';

export class MockAuthService implements IAuthService {
  login(): Promise<any> {
    return Promise.resolve({});
  }
}
