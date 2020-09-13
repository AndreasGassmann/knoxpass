import { Injectable } from '@nestjs/common';
import { Message } from '@knoxpass/api-interfaces';

@Injectable()
export class AppService {
	getData(): Message {
		return { message: 'Welcome to apii!' };
	}
}
