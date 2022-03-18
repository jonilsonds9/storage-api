import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { FileData } from '../files/file-data';

export class StorageConfig {
  static getStorage(): object {
    return diskStorage({
      destination: (req, file, callback) => {
        const { folder } = req.params;
        const pathFile = `./data/${folder}`;
        mkdirSync(pathFile, { recursive: true });
        callback(null, pathFile);
      },
      filename(req, file, callback) {
        callback(null, req.params.fileName);
      },
    });
  }

  static getFullPath(folder: string): string {
    return `${process.cwd()}/data/${folder}`;
  }

  static getFullPathWithFileName(fileData: FileData): string {
    return `${this.getFullPath(fileData.folder)}/${fileData.fileName}`;
  }
}
