import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
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
        dbName: configService.get<string>('MONGODB_DATABASE', 'db-cms'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
