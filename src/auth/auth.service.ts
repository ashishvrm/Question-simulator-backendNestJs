// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async validateOAuthLogin(profile: any): Promise<any> {
    const profileImageUrl = profile.photos[0]?.value || '';
    const user = await this.usersService.findOrCreateGoogleUser({
      googleId: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
      profileImageUrl: profileImageUrl,
    });

    const payload = { 
      username: user.username, 
      email: user.email, 
      sub: user.id, 
      profileImageUrl: user.profileImageUrl 
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async login(user: UserDocument) {
    const payload = {
      username: user.username,
      email: user.email,
      sub: user.id,
      profileImageUrl: user.profileImageUrl,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
