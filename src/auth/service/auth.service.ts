import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUsersService } from '../../users/service/users.service.interface';
import { IBcryptWraper } from '../../users/service/bcrypt/bcrypt-wrapper.interface';
import { LoginDTO } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    protected jwtService: JwtService,
    @Inject('IUsersService') private readonly usersService: IUsersService,
    @Inject('IBcryptWrapper') protected bcryptWrapper: IBcryptWraper,
  ) {}

  async login(data: LoginDTO): Promise<any> {
    const user = await this.usersService.getUserByUsername(data.username);
    if (!user || !(await this.bcryptWrapper.compare(data.password, user.password))) {
      throw new UnauthorizedException(`incorrect username ${data.username} or password`);
    }
    return {
      access_token: await this.jwtService.signAsync({
        sub: user._id,
        username: user.username,
      }),
    };
  }
}
