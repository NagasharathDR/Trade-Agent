// src/app/components/dashboard/dashboard.component.ts
import { Component, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgFor, NgIf,DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material modules imported locally (standalone)
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgFor, NgIf, FormsModule,DatePipe,
    MatToolbarModule, MatCardModule, MatInputModule, MatButtonModule, MatListModule, MatIconModule,MatButtonToggleModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
  ticker = '';
  timeframe = '1d';
  events: any[] = [];
  useMockBackend = true;
  mockIntervalRef: any;

  constructor(private api: ApiService) {
    // Start mock generator if mock mode on
    if (this.useMockBackend) this.startMockEvents();
  }

  analyzeTicker() {
    if (!this.ticker) { alert('Enter a ticker'); return; }

    if (this.useMockBackend) {
      const now = new Date();
      const mock = {
        ticker: this.ticker,
        verdict: { verdict: 'HOLD', confidence: 'MEDIUM', reasons: ['Mock: price near SMA50'] },
        evidence: `Mock evidence for ${this.ticker} (${this.timeframe}) @ ${now.toLocaleTimeString()}`,
        ts: now
      };
      this.unshiftEvent(mock);
      return;
    }

    this.api.analyze(this.ticker, this.timeframe).subscribe({
      next: (res) => {
        const ev = { ticker: this.ticker, verdict: res.verdict, evidence: res.evidence_string, ts: new Date() };
        this.unshiftEvent(ev);
      },
      error: (err) => {
        console.error('Analyze failed', err);
        alert('Backend analyze failed — check console and ensure backend is running.');
      }
    });
  }

  unshiftEvent(e: any) {
    this.events.unshift(e);
    if (this.events.length > 50) this.events.pop();
  }

  startMockEvents() {
    this.mockIntervalRef = setInterval(() => {
      const symbols = ['AAPL','TCS.NS','INFY.NS','MSFT','RELIANCE.NS'];
      const s = symbols[Math.floor(Math.random() * symbols.length)];
      const now = new Date();
      const mock = {
        ticker: s,
        verdict: { verdict: ['BUY','HOLD','SELL'][Math.floor(Math.random()*3)], confidence: ['HIGH','MEDIUM','LOW'][Math.floor(Math.random()*3)],
                  reasons: ['Mock volume spike','Mock SMA cross']},
        evidence: `Auto mock event for ${s} @ ${now.toLocaleTimeString()}`,
        ts: now
      };
      this.unshiftEvent(mock);
    }, 7000);
  }

  ngOnDestroy(): void {
    if (this.mockIntervalRef) clearInterval(this.mockIntervalRef);
  }
}
