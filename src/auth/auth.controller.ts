import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { RefreshTokenDto } from './dto/RefreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginHandler(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.login(loginDto);
  }

  @Put('refreshToken')
  async refreshAccessTokenHandler(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.refreshAccessToken(refreshTokenDto);
  }

  @Delete('logout')
  async logoutHandler(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
    await this.authService.logout(refreshTokenDto);
  }
}
