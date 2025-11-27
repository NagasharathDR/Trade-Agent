// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000/api'; // change when backend ready

  constructor(private http: HttpClient) {}

  analyze(ticker: string, timeframe: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/analyze`, { ticker, timeframe });
  }

  // stubs for future features
  addToWatchlist(payload: any) { return this.http.post(`${this.baseUrl}/watchlist`, payload); }
  getWatchlist() { return this.http.get(`${this.baseUrl}/watchlist`); }
  registerTrade(payload: any) { return this.http.post(`${this.baseUrl}/trade`, payload); }
}
