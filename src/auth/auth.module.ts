import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from './constant';
import { TokenManagerService } from './token-manager.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TimezoneModule } from 'src/timezone/timezone.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    UserModule,
    TimezoneModule,
    PassportModule,
    MessageModule,
    JwtModule.register({
      global: true,
      secret: jwtConstant.accessTokenSecret,
      signOptions: {
        expiresIn: '5m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenManagerService, JwtStrategy, PrismaService],
})
export class AuthModule {}
