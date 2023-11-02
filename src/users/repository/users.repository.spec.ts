import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoError } from 'mongodb';
import { HttpException, HttpStatus } from '@nestjs/common';
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
      // eslint-disable-next-line new-cap
      const modelResponse = await new mockUserModel(createUserDTOStub).save();
      expect(response).toStrictEqual(modelResponse);
    });

    it('should throw meaningful error when a duplicate key error is raised from the db', async () => {
      saveSpy = jest.spyOn(mockUserModel.prototype, 'save')
        .mockImplementationOnce(() => {
          const error = new MongoError('x');
          error.code = 11000;
          throw error;
        });
      constructorSpy = jest.spyOn(mockUserModel.prototype, 'constructorSpy');
      await expect(() => usersRepository.save(createUserDTOStub)).rejects.toThrow(
        new HttpException('username already exists', HttpStatus.CONFLICT),
      );
    });

    it('should throw other UserModel errors as they are', async () => {
      saveSpy = jest.spyOn(mockUserModel.prototype, 'save')
        .mockImplementationOnce(() => {
          throw new Error('sample error');
        });
      await expect(() => usersRepository.save(createUserDTOStub)).rejects.toThrow(
        new Error('sample error'),
      );
    });
  });

  describe('getByUsername', () => {
    let findOneSpy: jest.SpyInstance;

    it('should get a user by username from MongoDB and return it', async () => {
      findOneSpy = jest.spyOn(mockUserModel, 'findOne');
      const { username } = createUserDTOStub;
      const response = await usersRepository.getByUsername(username);
      expect(findOneSpy).toHaveBeenCalledWith({ username });
      const modelResponse = await mockUserModel.findOne({ username }).lean();
      expect(response).toStrictEqual(modelResponse);
    });
  });
});
