import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { MockUsersService } from '../service/mock.service.users';
import { UsersService } from '../service/users.service';
import { createUserDTOStub } from '../stubs/create-user-dto.stub';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: MockUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'IUsersService',
          useClass: MockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>('IUsersService');
  });

  describe('create', () => {
    it('should call the service method and return the result', () => {
      const serviceCreateSpy = jest.spyOn(usersService, 'create');
      const response = usersController.create(createUserDTOStub);
      expect(serviceCreateSpy).toBeCalledWith(createUserDTOStub);
      const serviceResponse = usersService.create(createUserDTOStub);
      expect(response).toStrictEqual(serviceResponse);
    });
  });
});
