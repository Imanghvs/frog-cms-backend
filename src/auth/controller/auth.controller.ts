import {
  Body, Controller, HttpStatus, Inject, Post, Res, ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginDTO } from '../dto';
import { IAuthService } from '../service/auth.service.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService') protected authService: IAuthService,
  ) {}

  @Post('login')
  async login(@Body(ValidationPipe) data: LoginDTO, @Res() response: Response): Promise<void> {
    const { accessToken } = await this.authService.login(data);
    response
      .cookie('access-token', accessToken, { httpOnly: true })
      .status(HttpStatus.NO_CONTENT)
      .json({});
  }
}
