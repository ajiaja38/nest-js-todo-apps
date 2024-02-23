import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayloadInterface } from 'src/auth/interface';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayloadInterface => {
    const req = context.switchToHttp().getRequest();
    return req.user as JwtPayloadInterface;
  },
);
