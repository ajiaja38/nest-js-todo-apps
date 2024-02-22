import { Injectable, NotFoundException } from '@nestjs/common';
import { TokenManagerService } from './token-manager.service';
import { UserService } from 'src/user/user.service';
import { MessageService } from 'src/message/message.service';
import { TimezoneService } from 'src/timezone/timezone.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/Login.dto';
import { RefreshTokenDto } from './dto/RefreshToken.dto';
import { Auth } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenManager: TokenManagerService,
    private readonly userService: UserService,
    private readonly message: MessageService,
    private readonly time: TimezoneService,
    private readonly prisma: PrismaService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.validateCredentials(loginDto);

    const accessToken: string =
      await this.tokenManager.generateAccessToken(user);
    const refreshToken: string =
      await this.tokenManager.generateRefreshToken(user);

    const saveRefreshToken: Auth = await this.prisma.auth.create({
      data: {
        refreshToken,
        expiredAt: this.time.getTimeZone(),
        author_id: user.id,
      },
    });

    this.message.setMessage('Berhasil Login');

    return {
      accessToken,
      refreshToken: saveRefreshToken.refreshToken,
    };
  }

  async refreshAccessToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    const data: Auth = await this.prisma.auth.findUnique({
      where: { refreshToken: refreshTokenDto.refreshToken },
    });

    if (!data) {
      throw new NotFoundException(
        'Refresh Token Tidak Valid, Silahkan Login Ulang!',
      );
    }

    this.message.setMessage('Berhasil refresh accessToken');
    const accessToken = await this.tokenManager.verifyRefreshToken(
      data.refreshToken,
    );

    return {
      accessToken,
    };
  }

  async logout(refreshTokenDto: RefreshTokenDto): Promise<void> {
    const result = await this.prisma.auth.delete({
      where: {
        refreshToken: refreshTokenDto.refreshToken,
      },
    });

    if (!result) {
      throw new NotFoundException('Gagal Logout, refreshToken tidak valid');
    }

    this.message.setMessage('Berhasil Logout');
  }
}
