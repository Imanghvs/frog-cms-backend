import { Test, TestingModule } from '@nestjs/testing';
import { MockUsersService } from './mock.service.users';
import { UsersService } from './users.service';
import { createUserDTOStub } from '../stubs/create-user-dto.stub';
import { MockUsersRepository } from '../repository/mock.users.repository';

describe('UsersController', () => {
  let usersService: MockUsersService;
  let usersRepository: MockUsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'IUsersRepository',
          useClass: MockUsersRepository,
        },
      ],
    }).compile();

    usersService = module.get<MockUsersService>(UsersService);
    usersRepository = module.get<MockUsersRepository>('IUsersRepository');
  });

  describe('create', () => {
    it('should call the repository method and return the result', async () => {
      const repositorySaveSpy = jest.spyOn(usersRepository, 'save');
      const response = await usersService.create(createUserDTOStub);
      expect(repositorySaveSpy).toBeCalledWith(createUserDTOStub);
      const repositoryResponse = await usersRepository.save(createUserDTOStub);
      expect(response).toStrictEqual(repositoryResponse);
    });
  });
});
