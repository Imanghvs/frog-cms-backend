import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { MockUsersService } from '../service/mock.users.service';
import { createUserDTOStub } from '../stubs/create-user-dto.stub';
import { IUsersService } from '../service/users.service.interface';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: IUsersService;

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
    usersService = module.get<IUsersService>('IUsersService');
  });

  describe('create', () => {
    it('should call the service method and return the result', async () => {
      const serviceCreateSpy = jest.spyOn(usersService, 'create');
      const response = await usersController.create(createUserDTOStub);
      expect(serviceCreateSpy).toBeCalledWith(createUserDTOStub);
      const serviceResponse = await usersService.create(createUserDTOStub);
      expect(response).toStrictEqual(serviceResponse);
    });
  });
});
