import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer, fileFilter } from './helpers';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('lote/:imageName')
  findLoteImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticLoteImage(imageName);
    res.sendFile(path);
  }

  @Post('lote')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/uploads',
        filename: fileNamer,
      }),
    }),
  )
  uploadLoteImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make surce that the file is an image');
    }
    const secureUrl = `${file.filename}`;
    return {
      secureUrl,
    };
  }
}
