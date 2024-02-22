import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionFilter } from './utils/filter/exception.filter';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';
import { MessageModule } from './message/message.module';
import { TimezoneModule } from './timezone/timezone.module';
import { UuidModule } from './uuid/uuid.module';
import { UploaderModule } from './uploader/uploader.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/v1/public',
    }),
    PrismaModule,
    UserModule,
    TodoModule,
    AuthModule,
    MessageModule,
    TimezoneModule,
    UuidModule,
    UploaderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
