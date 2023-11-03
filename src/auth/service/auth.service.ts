import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IUsersService } from '../../users/service/users.service.interface';
import { LoginDTO } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    protected jwtService: JwtService,
    @Inject('IUsersService') private readonly usersService: IUsersService,
  ) {}

  async login(data: LoginDTO): Promise<{ accessToken: string }> {
    const user = await this.usersService.getUserByUsername(data.username);
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException(`incorrect username ${data.username} or password`);
    }
    return {
      accessToken: await this.jwtService.signAsync({
        sub: user._id,
        username: user.username,
      }),
    };
  }
}
