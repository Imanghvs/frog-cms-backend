import {
  Controller, Post, Inject, Body, ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IUsersService } from '../service/users.service.interface';
import { CreateUserDTO } from '../dto';
import { CreateUserResponse } from '../types/create-user-response.type';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject('IUsersService') private readonly service: IUsersService,
  ) {}

  @Post()
  create(@Body(ValidationPipe) body: CreateUserDTO): Promise<CreateUserResponse> {
    return this.service.create(body);
  }
}
