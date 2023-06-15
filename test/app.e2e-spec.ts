import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { AppModule } from '../src/app.module';
import { createUserDTOStub } from '../src/users/stubs/create-user-dto.stub';
import { UserDocument, UserEntity } from '../src/users/schemas/users.schema';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri:
              'mongodb://'
              + `${encodeURIComponent(
                configService.get<string>('MONGODB_USERNAME', 'admin'),
              )}:`
              + `${encodeURIComponent(
                configService.get<string>('MONGODB_PASSWORD', '1234'),
              )}@`
              + `${configService.get<string>('MONGODB_HOSTNAME', 'localhost')}:`
              + `${configService.get<number>('MONGODB_PORT', 27017)}`,
            dbName: 'db-test',
          }),
          inject: [ConfigService],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    userModel = moduleFixture.get(getModelToken(UserEntity.name));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  it('/ (POST)', () => request(app.getHttpServer())
    .post('/users/')
    .set('Accept', 'application/json')
    .send(createUserDTOStub)
    .then((result) => {
      expect(result.statusCode).toBe(201);
      expect(result.body).toStrictEqual({
        ...createUserDTOStub,
        _id: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        __v: 0,
      });
    }));
});
