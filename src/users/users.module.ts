import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { UserEntity, UserSchema } from './schemas/users.schema';
import { UsersRepository } from './repository/users.respository';
import { BcryptWrapper } from './service/bcrypt/bcrypt-wrapper';

@Module({
  imports: [
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
  ],
})
export class UsersModule {
  static registerAsync(options: any): DynamicModule {
    return {
      module: UsersModule,
      imports: options.imports,
      providers: [
        {
          provide: 'IUsersConfig',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ],
    };
  }
}
