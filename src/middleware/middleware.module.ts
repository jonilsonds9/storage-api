import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';
import { FilesController } from '../files/files.controller';

@Module({
  imports: [],
})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: '/', method: RequestMethod.GET })
      .forRoutes(FilesController);
  }
}
