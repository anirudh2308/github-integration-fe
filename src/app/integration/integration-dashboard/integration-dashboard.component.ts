import { Component, OnInit } from '@angular/core';
import { IntegrationService } from '../../services/integration.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatChipListbox, MatChip } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConnectionStateService } from '../../services/connection.state.service';

@Component({
  selector: 'app-integration-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatCardModule,
    MatChipListbox,
    MatChip,
    MatProgressSpinnerModule,
  ],
  templateUrl: './integration-dashboard.component.html',
  styleUrls: ['./integration-dashboard.component.scss'],
})
export class IntegrationDashboardComponent implements OnInit {
  isConnected = false;
  connectedAt: string | null = null;
  isPanelOpen = false;
  loading = false;
  error = '';

  user: any;

  constructor(
    private integrationService: IntegrationService,
    private state: ConnectionStateService
  ) {}

  ngOnInit(): void {
    this.fetchStatus();
  }

  fetchStatus(): void {
    this.loading = true;
    this.integrationService
      .getStatus()
      .pipe(
        catchError((err) => {
          this.error = 'Failed to fetch integration status.';
          this.isConnected = false;
          this.user = null;
          this.connectedAt = null;
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (res && typeof res.connected !== 'undefined') {
          this.isConnected = res.connected;
          this.state.setConnected(res.connected);
          this.connectedAt = res.connectedAt || null;
          this.user = res.user?.userProfile || null;
          console.log('Fetched integration status:', res);
        } else {
          this.isConnected = false;
          this.state.setConnected(false);
          this.connectedAt = null;
          this.user = null;
        }
        this.loading = false;
      });
  }

  connect(): void {
    const oauthWindow = window.open(
      `${this.integrationService.baseUrl}/connect`,
      '_blank',
      'width=600,height=700'
    );

    const pollInterval = setInterval(() => {
      this.integrationService.getStatus().subscribe((res) => {
        if (res.connected) {
          this.isConnected = true;
          this.connectedAt = res.connectedAt;
          this.user = res.user?.userProfile || null;
          clearInterval(pollInterval);
          this.resync();

          if (oauthWindow) oauthWindow.close();
        }
      });
    }, 2000);
  }

  remove(): void {
    this.integrationService.removeIntegration().subscribe({
      next: () => {
        this.isConnected = false;
        this.connectedAt = null;
        this.user = null;
        this.state.setConnected(false);
      },
      error: () => (this.error = 'Failed to remove integration.'),
    });
  }

  resync(): void {
    if (!this.isConnected) return;

    this.loading = true;
    this.state.setConnected(false);
    this.error = '';

    this.integrationService.resyncIntegration().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.state.setConnected(true);
        console.log(`Resync complete: ${res.orgsFetched} org(s) fetched.`);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to resync integration.';
        console.error(err);
      },
    });
  }
}
