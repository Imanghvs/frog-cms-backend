import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose, { Model } from 'mongoose';
import * as cookie from 'cookie';
import { AppModule } from '../../src/app.module';
import { createUserDTOStub } from '../../src/users/stubs/create-user-dto.stub';
import { UserDocument, UserEntity } from '../../src/users/schemas/users.schema';

describe('LOGIN (e2e)', () => {
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

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/users/')
        .set('Accept', 'application/json')
        .send(createUserDTOStub)
        .then((result) => {
          expect(result.statusCode).toBe(201);
          expect(result.body).toStrictEqual({
            username: createUserDTOStub.username,
            id: expect.anything(),
          });
        });
    });
    afterEach(async () => {
      await userModel.deleteMany({});
    });

    it('should end up in unauthorized error when username does not exist', () => request(app.getHttpServer())
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send({ username: 'David', password: '1234' })
      .then((result) => {
        expect(result.statusCode).toBe(401);
        expect(result.body).toStrictEqual({
          error: 'Unauthorized',
          message: 'incorrect username David or password',
          statusCode: 401,
        });
      }));

    it('should end up in unauthorized error when '
     + 'username exists but password is wrong', () => request(app.getHttpServer())
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send({ username: createUserDTOStub.username, password: '1234' })
      .then((result) => {
        expect(result.statusCode).toBe(401);
        expect(result.body).toStrictEqual({
          error: 'Unauthorized',
          message: `incorrect username ${createUserDTOStub.username} or password`,
          statusCode: 401,
        });
      }));

    it('should return a valid token when username and password are correct', () => request(app.getHttpServer())
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send({ username: createUserDTOStub.username, password: createUserDTOStub.password })
      .then((result) => {
        expect(result.statusCode).toBe(204);
        expect(result.body).toStrictEqual({});
        const parsedCookie = cookie.parse(result.get('Set-Cookie')[0]);
        expect(parsedCookie).toStrictEqual({
          Path: '/',
          'access-token': expect.anything(),
        });
        const accessToken = parsedCookie['access-token'];
        expect(JSON.parse(
          Buffer.from(accessToken.split('.')[1], 'base64').toString('utf-8'),
        )).toStrictEqual({
          exp: expect.anything(),
          iat: expect.anything(),
          username: createUserDTOStub.username,
          sub: expect.anything(),
        });
        expect(JSON.parse(
          Buffer.from(accessToken.split('.')[0], 'base64').toString('utf-8'),
        )).toStrictEqual({
          alg: 'HS256',
          typ: 'JWT',
        });
      }));
  });
});
