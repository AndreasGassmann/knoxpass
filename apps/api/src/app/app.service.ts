import { Injectable } from '@nestjs/common';
interface Message {
  message: string;
}

@Injectable()
export class AppService {
  getData(): Message {
    return { message: 'Welcome to our api!' };
  }
}
