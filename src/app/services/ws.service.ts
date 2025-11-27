// src/app/services/ws.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WsService {
  private socket$: WebSocketSubject<any> | null = null;

  connect(wsUrl: string): Observable<any> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(wsUrl);
    }
    return this.socket$.asObservable();
  }

  send(msg: any) {
    this.socket$?.next(msg);
  }

  close() {
    this.socket$?.complete();
    this.socket$ = null;
  }
}
