import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose, { Model } from 'mongoose';
import { AppModule } from '../../src/app.module';
import { createUserDTOStub } from '../../src/users/stubs/create-user-dto.stub';
import { UserDocument, UserEntity } from '../../src/users/schemas/users.schema';

describe('CREATE USER (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
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
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    userModel = moduleFixture.get(getModelToken(UserEntity.name));
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close(), mongoose.disconnect()]);
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  describe('/users (POST)', () => {
    it('should end up in error when username is not acceptable', () => request(app.getHttpServer())
      .post('/users/')
      .set('Accept', 'application/json')
      .send({ ...createUserDTOStub, username: 'Iman' })
      .then((result) => {
        expect(result.statusCode).toBe(400);
        expect(result.body).toStrictEqual({
          error: 'Bad Request',
          message: [
            'username must be a lowercase string',
          ],
          statusCode: 400,

        });
      }));
    it('should end up in error when password is too short', () => request(app.getHttpServer())
      .post('/users/')
      .set('Accept', 'application/json')
      .send({ ...createUserDTOStub, password: 'Qw@1' })
      .then((result) => {
        expect(result.statusCode).toBe(400);
        expect(result.body).toStrictEqual({
          error: 'Bad Request',
          message: [
            'password should contain at least one lowercase letter, '
            + 'one uppercase letter,one numeric digit, and one special character',
            'minLength-{"ln":6,"count":6}',
          ],
          statusCode: 400,

        });
      }));
    it('should end up in error when password is too long', () => request(app.getHttpServer())
      .post('/users/')
      .set('Accept', 'application/json')
      .send({ ...createUserDTOStub, password: 'Qwer@1234Qwer@1234Qwe' })
      .then((result) => {
        expect(result.statusCode).toBe(400);
        expect(result.body).toStrictEqual({
          error: 'Bad Request',
          message: [
            'password should contain at least one lowercase letter, '
            + 'one uppercase letter,one numeric digit, and one special character',
            'maxLength-{"ln":20,"count":20}',
          ],
          statusCode: 400,

        });
      }));
    it('should end up in error when password does not contain digits', () => request(app.getHttpServer())
      .post('/users/')
      .set('Accept', 'application/json')
      .send({ ...createUserDTOStub, password: 'Qwer@Qwer' })
      .then((result) => {
        expect(result.statusCode).toBe(400);
        expect(result.body).toStrictEqual({
          error: 'Bad Request',
          message: [
            'password should contain at least one lowercase letter, '
            + 'one uppercase letter,one numeric digit, and one special character',
          ],
          statusCode: 400,

        });
      }));
    it('should end up in error when password does not contain capital letters', () => request(app.getHttpServer())
      .post('/users/')
      .set('Accept', 'application/json')
      .send({ ...createUserDTOStub, password: 'qwer@1234' })
      .then((result) => {
        expect(result.statusCode).toBe(400);
        expect(result.body).toStrictEqual({
          error: 'Bad Request',
          message: [
            'password should contain at least one lowercase letter, '
            + 'one uppercase letter,one numeric digit, and one special character',
          ],
          statusCode: 400,

        });
      }));
    it('should end up in error when password does not contain lowercase letters', () => request(app.getHttpServer())
      .post('/users/')
      .set('Accept', 'application/json')
      .send({ ...createUserDTOStub, password: 'QWER@1234' })
      .then((result) => {
        expect(result.statusCode).toBe(400);
        expect(result.body).toStrictEqual({
          error: 'Bad Request',
          message: [
            'password should contain at least one lowercase letter, '
            + 'one uppercase letter,one numeric digit, and one special character',
          ],
          statusCode: 400,

        });
      }));
    it('should end up in error when password does not contain special characters', () => request(app.getHttpServer())
      .post('/users/')
      .set('Accept', 'application/json')
      .send({ ...createUserDTOStub, password: 'Qwer1234' })
      .then((result) => {
        expect(result.statusCode).toBe(400);
        expect(result.body).toStrictEqual({
          error: 'Bad Request',
          message: [
            'password should contain at least one lowercase letter, '
            + 'one uppercase letter,one numeric digit, and one special character',
          ],
          statusCode: 400,

        });
      }));
    it('should make a user successfully', () => request(app.getHttpServer())
      .post('/users/')
      .set('Accept', 'application/json')
      .send(createUserDTOStub)
      .then((result) => {
        expect(result.statusCode).toBe(201);
        expect(result.body).toStrictEqual({
          username: createUserDTOStub.username,
          id: expect.anything(),
        });
      }));
    it('should result in error for duplicate usernames', async () => {
      await request(app.getHttpServer())
        .post('/users/')
        .set('Accept', 'application/json')
        .send(createUserDTOStub);
      return request(app.getHttpServer())
        .post('/users/')
        .set('Accept', 'application/json')
        .send(createUserDTOStub)
        .then((result) => {
          expect(result.statusCode).toBe(409);
          expect(result.body).toStrictEqual({
            message: 'username already exists',
            statusCode: 409,
          });
        });
    });
  });
});
