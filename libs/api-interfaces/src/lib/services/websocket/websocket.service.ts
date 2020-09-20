import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';

import { EMPTY } from 'rxjs';
import { generateGUID } from '../../utils/generate-uuid';
import {
  generateChallengeSignature,
  getSigningKeypairFromSeed,
} from '../../utils/crypto';
import { KeyPair } from 'libsodium-wrappers';

const WS_URL = 'ws://18.217.144.218:3333/';

const isConnected = (
  socket: WebSocketSubject<any> | undefined
): socket is WebSocketSubject<any> => {
  return Boolean(socket && !socket.closed);
};

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private uuid: string | undefined;
  private keypair: KeyPair | undefined;

  private socket$: WebSocketSubject<{ event: string; data: any }> | undefined;

  constructor() {
    generateGUID().then((uuid) => {
      this.uuid = uuid;
      getSigningKeypairFromSeed(uuid).then((keypair) => {
        this.keypair = keypair;
      });
    });
  }

  public connect(): void {
    console.log('connecting');
    if (!isConnected(this.socket$)) {
      this.socket$ = this.getNewWebSocket();
      const messages = this.socket$.pipe(
        tap({
          error: (error: Error) => console.log(error),
        }),
        catchError((_) => EMPTY)
      );
      messages.subscribe((res) => {
        console.log('msg', res);
        if (!this.keypair) {
          console.log('KEYPAIR IS UNDEFINED');
          return;
        }
        if (res.event === 'challenge') {
          generateChallengeSignature(res.data, this.keypair).then(
            (signature) => {
              this.sendMessage({ event: 'auth', data: signature });
            }
          );
        }
      });
    } else {
      console.log('WRONG');
    }
  }

  public sendMessage(message: { event: string; data: any }) {
    if (isConnected(this.socket$)) {
      this.socket$.next(message);
    }
  }

  public close() {
    if (isConnected(this.socket$)) {
      this.socket$.complete();
    }
  }

  private getNewWebSocket() {
    return webSocket<{ event: string; data: any }>(WS_URL);
  }
}
