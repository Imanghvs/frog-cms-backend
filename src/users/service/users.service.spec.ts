import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { createUserDTOStub } from '../stubs/create-user-dto.stub';
import { MockUsersRepository } from '../repository/mock.users.repository';

describe('UsersController', () => {
  let usersService: UsersService;
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

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<MockUsersRepository>('IUsersRepository');
  });

  describe('create', () => {
    it('should call the repository method and return the result', async () => {
      const repositorySaveSpy = jest.spyOn(usersRepository, 'save');
      const response = await usersService.create(createUserDTOStub);
      expect(repositorySaveSpy).toBeCalledWith({
        ...createUserDTOStub,
        password: expect.anything(),
      });
      expect(response).toStrictEqual({
        id: expect.anything(),
        username: createUserDTOStub.username,
      });
    });
  });

  describe('getUserByUsername', () => {
    it('should return complete getByUsername repository response', async () => {
      const repositoryGetByUsernameSpy = jest.spyOn(usersRepository, 'getByUsername');
      const response = await usersService.getUserByUsername('sample-username');
      expect(repositoryGetByUsernameSpy).toBeCalledWith('sample-username');
      expect(response).toStrictEqual(await usersRepository.getByUsername('sample-username'));
    });
  });
});
