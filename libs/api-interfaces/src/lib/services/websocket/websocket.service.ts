import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';

import { EMPTY } from 'rxjs';

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
  private socket$: WebSocketSubject<{ event: string; data: any }> | undefined;

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
