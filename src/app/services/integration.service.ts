import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IntegrationStatus {
  connected: boolean;
  connectedAt: string;
  user?: any;
}

@Injectable({
  providedIn: 'root',
})
export class IntegrationService {
  baseUrl = 'http://localhost:3000/auth/github';

  constructor(private http: HttpClient) {}

  getStatus(): Observable<IntegrationStatus> {
    return this.http.get<IntegrationStatus>(`${this.baseUrl}/status`);
  }

  connectIntegration(): void {
    window.open(`${this.baseUrl}/connect`, '_blank');
  }

  removeIntegration(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove`);
  }

  resyncIntegration(): Observable<any> {
    return this.http.post(`${this.baseUrl}/resync`, {});
  }
}
