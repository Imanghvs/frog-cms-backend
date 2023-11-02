import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { IUsersService } from '../../users/service/users.service.interface';
import { BcryptWrapper } from '../../users/service/bcrypt/bcrypt-wrapper';
import { AuthService } from './auth.service';
import { loginDTOStub } from '../stubs/login-dto.stub';
import { MockUsersService } from '../../users/service/mock.users.service';

process.env.JWT_SECRET = 'lasdfasjhdfakjshd';
describe('AuthService', () => {
  let authService: AuthService;
  let usersService: IUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'IBcryptWrapper',
          useClass: BcryptWrapper,
        },
        {
          provide: 'IUsersService',
          useClass: MockUsersService,
        },
      ],
      imports: [JwtModule.register({
        global: true,
        secret: 'UNSAFE KEY FOR TEST',
        signOptions: { expiresIn: '24h' },
      })],
    }).compile();

    usersService = module.get<IUsersService>('IUsersService');
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should throw if the user does not exist', async () => {
      jest.spyOn(usersService, 'getUserByUsername')
        .mockImplementationOnce(() => Promise.resolve(null));

      await expect(() => authService.login(loginDTOStub))
        .rejects
        .toThrow(new UnauthorizedException(`incorrect username ${loginDTOStub.username} or password`));
    });

    it('should throw if the password does not match', async () => {
      await expect(() => authService.login({
        username: loginDTOStub.username,
        password: '4321@rewQ',
      }))
        .rejects
        .toThrow(new UnauthorizedException(`incorrect username ${loginDTOStub.username} or password`));
    });

    it('should return valid access token if username and password are correct', async () => {
      const getUserByUsernameSpy = jest.spyOn(usersService, 'getUserByUsername');
      const response = await authService.login(loginDTOStub);
      expect(getUserByUsernameSpy).toBeCalledWith(loginDTOStub.username);
      expect(response).toStrictEqual({ access_token: expect.anything() });
      expect(JSON.parse(
        Buffer.from(response.access_token.split('.')[1], 'base64').toString('utf-8'),
      )).toStrictEqual({
        exp: expect.anything(),
        iat: expect.anything(),
        sub: expect.anything(),
        username: loginDTOStub.username,
      });
      expect(JSON.parse(
        Buffer.from(response.access_token.split('.')[0], 'base64').toString('utf-8'),
      )).toStrictEqual({
        alg: 'HS256',
        typ: 'JWT',
      });
    });
  });
});
