import { Injectable } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class UploaderService {
  async deleteFile(filename: string): Promise<void> {
    const filePath = resolve(__dirname, `../../public/${filename}`);
    unlinkSync(filePath);
  }
}
