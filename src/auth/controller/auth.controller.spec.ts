import { Test, TestingModule } from '@nestjs/testing';
import { createUserDTOStub } from '../../users/stubs/create-user-dto.stub';
import { AuthController } from './auth.controller';
import { IAuthService } from '../service/auth.service.interface';
import { MockAuthService } from '../service/mock.auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: IAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'IUsersService',
          useClass: MockAuthService,
        },
        {
          provide: 'IAuthService',
          useClass: MockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<IAuthService>('IAuthService');
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call the service method and return the result', async () => {
      const input = {
        username: createUserDTOStub.username,
        password: createUserDTOStub.password,
      };
      const serviceLoginSpy = jest.spyOn(authService, 'login');
      const response = await authController.login(input);
      expect(serviceLoginSpy).toBeCalledWith(input);
      const serviceResponse = await authService.login(input);
      expect(response).toStrictEqual(serviceResponse);
    });
  });
});
