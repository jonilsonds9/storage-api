import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    FilesModule,
    MiddlewareModule,
    ConfigModule.forRoot(),
    MulterModule.register(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
