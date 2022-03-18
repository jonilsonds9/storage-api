import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const accessKey = req.get('AccessKey');
    if (
      process.env.ACCESS_KEY === undefined ||
      accessKey === undefined ||
      process.env.ACCESS_KEY !== accessKey
    ) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}
