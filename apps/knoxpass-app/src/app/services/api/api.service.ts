import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const URL = 'https://localhost:3333';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  public registerPushToken(token: string): void {
    this.http.post(`${URL}/register/push`, {
      token,
    });
  }
}
