import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/config/multer.config';
import { resolve } from 'path';

@Controller('uploader')
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', multerOptions(resolve(__dirname, '../../public'))),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string; filename: string }> {
    return {
      url: `http://localhost:5000/v1/public/${file.filename}`,
      filename: file.filename,
    };
  }
}
