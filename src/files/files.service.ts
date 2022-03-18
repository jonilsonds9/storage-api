import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FileData } from './file-data';
import { createReadStream, existsSync, ReadStream, unlinkSync } from 'fs';
import { StorageConfig } from '../config/storage';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {}

  async upload(fileData: FileData): Promise<void> {
    await this.filesRepository.save({ ...fileData });
  }

  async delete(fileData: FileData): Promise<void> {
    const fullPathWithFileName = this.getFullPathIfFileExists(fileData);

    try {
      const file = await this.filesRepository.findOneOrFail({
        where: { folder: fileData.folder, fileName: fileData.fileName },
      });
      if (file != undefined) await this.filesRepository.delete(file.id);
      unlinkSync(fullPathWithFileName);
    } catch (error) {
      throw new BadRequestException('Object delete failed');
    }
  }

  download(fileData: FileData): ReadStream {
    const fullPathWithFileName = this.getFullPathIfFileExists(fileData);
    return createReadStream(fullPathWithFileName);
  }

  getFullPathIfFileExists(fileData: FileData): string {
    const fullPathWithFileName =
      StorageConfig.getFullPathWithFileName(fileData);

    if (!existsSync(fullPathWithFileName)) {
      throw new NotFoundException();
    }

    return fullPathWithFileName;
  }
}
