import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createUserDTOStub } from '../stubs/create-user-dto.stub';
import { UsersRepository } from './users.respository';
import { UserDocument, UserEntity } from '../schemas/users.schema';
import { MockUserModel } from './mock.model';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let mockUserModel: Model<UserDocument>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getModelToken(UserEntity.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();
    mockUserModel = module.get(getModelToken(UserEntity.name));
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('save', () => {
    let saveSpy: jest.SpyInstance;
    let constructorSpy: jest.SpyInstance;

    it('should get a new instance of entity and save it', async () => {
      saveSpy = jest.spyOn(mockUserModel.prototype, 'save');
      constructorSpy = jest.spyOn(mockUserModel.prototype, 'constructorSpy');
      const response = await usersRepository.save(createUserDTOStub);
      expect(saveSpy).toHaveBeenCalled();
      expect(constructorSpy).toHaveBeenCalledWith(createUserDTOStub);
      expect(response).toStrictEqual(createUserDTOStub);
    });
  });
});
