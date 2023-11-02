import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { UserEntity, UserSchema } from './schemas/users.schema';
import { UsersRepository } from './repository/users.respository';
import { BcryptWrapper } from './service/bcrypt/bcrypt-wrapper';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: 'IUsersService',
      useClass: UsersService,
    },
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
    {
      provide: 'IBcryptWrapper',
      useClass: BcryptWrapper,
    },
    {
      provide: 'IUsersConfig',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        salt: configService.get('SALT', '$2a$10$W7gJK5i.AgJtuI/zIW1jh.'),
      }),
    },
  ],
  exports: [{ provide: 'IUsersService', useClass: UsersService }],
})
export class UsersModule {}
