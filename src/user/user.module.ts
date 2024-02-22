import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageModule } from 'src/message/message.module';
import { TimezoneModule } from 'src/timezone/timezone.module';
import { UuidModule } from 'src/uuid/uuid.module';

@Module({
  imports: [MessageModule, TimezoneModule, UuidModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
