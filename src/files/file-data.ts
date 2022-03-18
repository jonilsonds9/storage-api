import { IsNotEmpty, IsString } from 'class-validator';

export class FileData {
  @IsNotEmpty()
  @IsString({ message: 'folder deveria ser uma string' })
  folder: string;

  @IsNotEmpty()
  @IsString({ message: 'fileName deveria ser uma string' })
  fileName: string;

  constructor(folder: string, fileName: string) {
    this.folder = folder;
    this.fileName = fileName;
  }

  // public static toModel(fileData: FileData): File {
  //   const file = new File(fileData.folder, fileData.fileName);
  //   return file;
  // }
}
