import { Injectable, NotFoundException, } from '@nestjs/common';
import { FileData } from './file-data';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../entities/file.entity';
import { config, S3 } from 'aws-sdk';
import * as Buffer from 'buffer';
import stream from 'node:stream';

@Injectable()
export class FilesService {
  private s3: S3;

  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {
    config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    this.s3 = new S3();
  }

  async upload(fileData: FileData, fileBuffer: Buffer): Promise<void> {
    await this.s3.upload({
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: fileBuffer,
      Key: `${fileData.folder}/${fileData.fileName}`
    }).promise();

    await this.filesRepository.save({ ...fileData });
  }

  async delete(fileData: FileData): Promise<void> {
    const fileInfo = await this.filesRepository.findOne({
      where: { folder: fileData.folder, fileName: fileData.fileName },
    });
    if (fileInfo == undefined) throw new NotFoundException();
    
    const fullPathWithFileName = this.getFullPathIfFileExists(fileData);
    await this.s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fullPathWithFileName
    }).promise();

    await this.filesRepository.delete(fileInfo.id)
  }

  async download(fileData: FileData): Promise<stream.Readable> {
    const fileInfo = await this.filesRepository.findOne({
      where: { folder: fileData.folder, fileName: fileData.fileName },
    });
    if (fileInfo) {
      const fullPathWithFileName = this.getFullPathIfFileExists(fileData);

      return this.s3.getObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fullPathWithFileName,
      }).createReadStream();
    }
    throw new NotFoundException();
  }

  getFullPathIfFileExists(fileData: FileData): string {
    return `${fileData.folder}/${fileData.fileName}`;
  }
}
