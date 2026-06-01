import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      name: 'G-Scores API',
      status: 'ok',
    };
  }
}
