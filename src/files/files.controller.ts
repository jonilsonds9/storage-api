import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileData } from './file-data';
import { FileDataInterceptor } from './file-data.interceptor';
import { Response } from 'express';
import { contentType } from 'mime-types';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  home(): object {
    return { message: 'Storage API' };
  }

  @Get('/:folder/:fileName')
  download(
    @Param() fileData: FileData,
    @Res({ passthrough: true }) response: Response,
  ): StreamableFile {
    const file = this.filesService.download(fileData);
    const contentType1 = contentType(fileData.fileName);
    response.set({
      'Content-Type': contentType1,
    });
    const streamableFile = new StreamableFile(file);
    return streamableFile;
  }

  @Put('/:folder/:fileName')
  @UseInterceptors(
    FileDataInterceptor,
    FileInterceptor('data'),
  )
  async upload(
    @Param() fileData: FileData,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<object> {
    if (file === undefined)
      throw new BadRequestException(
        "Campo arquivo com nome 'data' é obrigatório",
      );

    await this.filesService.upload(fileData, file.buffer);

    return response
      .status(HttpStatus.CREATED)
      .send({ HttpCode: 201, Message: 'File uploaded.' });
  }

  @Delete('/:folder/:fileName')
  async delete(
    @Param() fileData: FileData,
    @Res() response: Response,
  ): Promise<object> {
    await this.filesService.delete(fileData);

    return response
      .status(HttpStatus.OK)
      .send({ HttpCode: 200, Message: 'Object was successfully deleted' });
  }
}
