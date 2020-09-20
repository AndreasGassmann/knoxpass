import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'ws';

import { verifyChallengeSignature } from '@knoxpass/api-interfaces';

enum SocketStatus {
  WAITING_FOR_AUTH,
  CONNECTED,
}

@WebSocketGateway()
export class EventsGateway {
  private connectedClients: [
    string | undefined,
    SocketStatus,
    WebSocket
  ][] = [];

  @WebSocketServer() server: Server | undefined;

  private logger: Logger = new Logger('Websockets');

  sendToPKH(pkh: string, message: any) {
    const client = this.connectedClients.find(
      (connectedClient) => connectedClient[0] === pkh
    );

    if (client) {
      client[2].send(JSON.stringify({ event: 'message', data: message }));
    }
  }

  @SubscribeMessage('relay')
  handleMessage(@MessageBody() data: any) {
    console.log('data', data);
    if (data.recipient) {
      this.sendToPKH(data.recipient, data.message);
    }
  }

  @SubscribeMessage('auth')
  async handleAuthMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: WebSocket
  ): Promise<boolean> {
    console.log('data', data);

    const pkh = await verifyChallengeSignature(data);

    console.log('pkh', pkh);

    this.connectedClients.forEach(
      (connectedClient: [string | undefined, SocketStatus, WebSocket]) => {
        if (connectedClient[2] === client) {
          connectedClient[0] = pkh;
        }
      }
    );

    return false;
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: WebSocket) {
    let index = -1;
    this.connectedClients.forEach(
      (
        connectedClient: [string | undefined, SocketStatus, WebSocket],
        i: number
      ) => {
        if (connectedClient[2] === client) {
          index = i;
        }
      }
    );
    this.connectedClients.splice(index, 1);
    this.logger.log(`Client disconnected`);
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    this.connectedClients.push([
      undefined,
      SocketStatus.WAITING_FOR_AUTH,
      client,
    ]);
    this.logger.log(`Client connected`);
    client.send(
      JSON.stringify({
        event: 'challenge',
        data: {
          difficulty: 0,
          challenge: 'test',
          expiration: new Date().getTime(),
        },
      })
    );
  }
}
