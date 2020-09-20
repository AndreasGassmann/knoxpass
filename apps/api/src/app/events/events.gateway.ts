import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer() server: Server | undefined;

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('events')
  handleMessage(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log('data', data);
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item }))
    );
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client}`);
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client}`);
  }
}
