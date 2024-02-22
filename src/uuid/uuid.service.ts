import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UuidService {
  generateId(prefix: string): string {
    return `${prefix}-${uuidv4()}`;
  }
}
