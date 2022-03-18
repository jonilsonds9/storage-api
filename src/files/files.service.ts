import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FileData } from './file-data';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  ReadStream,
  unlinkSync,
} from 'fs';
import { StorageConfig } from '../config/storage';
import * as Buffer from 'buffer';

@Injectable()
export class FilesService {
  upload(fileData: FileData): void {
    const fullPathWithFileName = FilesService.createFolderTree(fileData);
  }

  delete(fileData: FileData): void {
    const fullPathWithFileName = this.getFullPathIfFileExists(fileData);

    try {
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

  private static createFolderTree(data: FileData): string {
    const fullPath = StorageConfig.getFullPath(data.folder);

    mkdirSync(fullPath, { recursive: true });

    return `${fullPath}/${data.fileName}`;
  }
}
