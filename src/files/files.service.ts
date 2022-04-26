import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { FileData } from './file-data';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../entities/file.entity';
import * as Buffer from 'buffer';
import { createReadStream, createWriteStream, existsSync, mkdirSync, ReadStream, unlinkSync } from 'fs';

@Injectable()
export class FilesService {

  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {}

  async upload(fileData: FileData, fileBuffer: Buffer): Promise<void> {
    const fullPathWithFileName = this.createFolderTree(fileData);
  
    const writeStream = createWriteStream(fullPathWithFileName);
    writeStream.write(fileBuffer);

    await this.filesRepository.save({ ...fileData });
  }

  async delete(fileData: FileData): Promise<void> {
    const fileInfo = await this.filesRepository.findOne({
      where: { folder: fileData.folder, fileName: fileData.fileName },
    });
    if (fileInfo == undefined) throw new NotFoundException();
    
    const fullPath = this.getFullPathIfFileExists(fileData);
    try {
      unlinkSync(fullPath);
    } catch (error) {
      throw new BadRequestException('Object delete failed');
    }

    await this.filesRepository.delete(fileInfo.id)
  }

  download(fileData: FileData): ReadStream {
    const fullPathWithFileName = this.getFullPathIfFileExists(fileData);
    return createReadStream(fullPathWithFileName);
  }

  getFullPathIfFileExists(fileData: FileData): string {
    const fullPathWithFileName = this.getFullPathWithFileName(fileData);
    
    if (!existsSync(fullPathWithFileName)) {
      throw new NotFoundException();
    }
    
    return fullPathWithFileName;
  }

  private getFullPath(fileData: FileData): string {
    return `${process.cwd()}/data/${fileData.folder}`;
  }

  private getFullPathWithFileName(fileData: FileData): string {
    return `${this.getFullPath(fileData)}/${fileData.fileName}`;
  }

  private createFolderTree(data: FileData): string {
    const fullPath = this.getFullPath(data);
    
    mkdirSync(fullPath, { recursive: true });
    
    return `${fullPath}/${data.fileName}`;
  }
}
