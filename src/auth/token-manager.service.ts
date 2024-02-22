import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './interface';
import { jwtConstant } from './constant';

@Injectable()
export class TokenManagerService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(jwtPayload: JwtPayloadInterface): Promise<string> {
    return await this.jwtService.signAsync({ ...jwtPayload });
  }

  async generateRefreshToken(jwtPayload: JwtPayloadInterface): Promise<string> {
    return await this.jwtService.signAsync(
      { ...jwtPayload },
      {
        secret: jwtConstant.refreshTokenSecret,
        expiresIn: '7d',
      },
    );
  }

  async verifyRefreshToken(refreshToken: string): Promise<string> {
    const payload: JwtPayloadInterface = await this.jwtService.verify(
      refreshToken,
      {
        secret: jwtConstant.refreshTokenSecret,
      },
    );

    const jwtPayload: JwtPayloadInterface = {
      id: payload.id,
      name: payload.name,
      role: payload.role,
    };

    return await this.generateAccessToken(jwtPayload);
  }
}
