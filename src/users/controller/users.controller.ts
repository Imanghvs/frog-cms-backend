import {
  Controller, Post, Inject, Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IUsersService } from '../service/users.service.interface';
import { CreateUserDTO } from '../dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject('IUsersService') private readonly service: IUsersService,
  ) {}

  @Post()
  create(@Body() body: CreateUserDTO): object {
    return this.service.create(body);
  }
}
