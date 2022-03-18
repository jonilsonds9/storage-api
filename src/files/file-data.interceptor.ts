import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileData } from './file-data';
import { validateSync } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileDataInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const fileData = new FileData(
      request.params.folder,
      request.params.fileName,
    );

    const validationErrors = validateSync(fileData, {
      validationError: { target: false },
    });
    if (validationErrors.length > 0)
      throw new BadRequestException(validationErrors);

    const file = await this.filesRepository.findOne({
      where: { folder: fileData.folder, fileName: fileData.fileName },
    });
    if (file != undefined) throw new BadRequestException('Objeto já existe');

    return next.handle();
  }
}
