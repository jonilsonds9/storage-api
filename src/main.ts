import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import agent from 'skywalking-backend-js';

async function bootstrap() {
  agent.start({
    serviceName: 'storage-api-service',
    serviceInstance: 'storage-api-instance',
    collectorAddress: '127.0.0.1:11800',
  });

  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
