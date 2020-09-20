import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const URL = 'https://localhost:3333';

export interface ApiChallenge {
  difficulty: number;
  challenge: string;
  expiration: number;
}

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  constructor(private readonly http: HttpClient) {}

  public async getChallenge(): Promise<ApiChallenge> {
    return this.http.get<ApiChallenge>(`${URL}/challenge`).toPromise();
  }

  /**
   * Register the mobile push notification token on the server
   *
   * @param publicKey
   * @param token
   */
  public async registerPushToken(pkh: string, token: string): Promise<void> {
    return this.http
      .post<void>(`${URL}/register/push`, {
        pkh,
        token,
      })
      .toPromise();
  }

  public async registerClient(pkh: string, token: string) {
    return this.http
      .post<void>(`${URL}/register/client`, {
        pkh,
      })
      .toPromise();

    // Get register difficulty
    // Send pkh to server
  }

  public async startListeningForChannelOpening() {}
  public async stopListeningForChannelOpening() {}

  public async openChannel(signPublicKey: string, boxPublicKey: string) {}

  public async sendToPKH(pk: string, payload: string) {
    // encrypt payload with pk
    // generate pkh
    const pkh = pk;
    const encryptedPayload = payload;

    this.http.post(`${URL}/send`, {
      pkh,
      encryptedPayload,
    });
  }
}
