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

@Injectable()
export class FileDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
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
    return next.handle();
  }
}
