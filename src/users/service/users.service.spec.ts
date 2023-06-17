import { Test, TestingModule } from '@nestjs/testing';
import { MockUsersService } from './mock.service.users';
import { UsersService } from './users.service';
import { createUserDTOStub } from '../stubs/create-user-dto.stub';
import { MockUsersRepository } from '../repository/mock.users.repository';
import { BcryptWrapper } from './bcrypt/bcrypt-wrapper';

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
        {
          provide: 'IBcryptWrapper',
          useClass: BcryptWrapper,
        },
        {
          provide: 'IUsersConfig',
          useValue: { salt: '$2a$10$W7gJK5i.AgJtuI/zIW1jh.' },
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
      const repositoryExpectedInput = {
        ...createUserDTOStub,
        password: '$2a$10$W7gJK5i.AgJtuI/zIW1jh.SJ92out48OVaOhhcq0yps7xLecSWTCi',
      };
      expect(repositorySaveSpy).toBeCalledWith(repositoryExpectedInput);
      const repositoryResponse = await usersRepository.save(repositoryExpectedInput);
      expect(response).toStrictEqual({
        id: repositoryResponse._id,
        username: repositoryResponse.username,
      });
    });
  });
});
