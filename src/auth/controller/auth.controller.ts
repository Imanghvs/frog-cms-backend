import {
  Body, Controller, Inject, Post, ValidationPipe,
} from '@nestjs/common';
import { LoginDTO } from '../dto';
import { IAuthService } from '../service/auth.service.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService') protected authService: IAuthService,
  ) {}

  @Post('login')
  login(@Body(ValidationPipe) data: LoginDTO) {
    return this.authService.login(data);
  }
}
