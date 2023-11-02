import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { UserEntity, UserSchema } from './schemas/users.schema';
import { UsersRepository } from './repository/users.respository';

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
  ],
  exports: [{ provide: 'IUsersService', useClass: UsersService }],
})
export class UsersModule {}
