import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TimezoneModule } from 'src/timezone/timezone.module';
import { MessageModule } from 'src/message/message.module';
import { UuidModule } from 'src/uuid/uuid.module';

@Module({
  imports: [PrismaModule, TimezoneModule, MessageModule, UuidModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
