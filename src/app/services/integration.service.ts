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

  /** ✅ Get GitHub integration status */
  getStatus(): Observable<IntegrationStatus> {
    return this.http.get<IntegrationStatus>(`${this.baseUrl}/status`);
  }

  /** ✅ Start OAuth flow */
  connectIntegration(): void {
    window.open(`${this.baseUrl}/connect`, '_blank');
  }

  /** ✅ Remove GitHub integration */
  removeIntegration(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove`);
  }

  /** ✅ Resync integration data */
  resyncIntegration(): Observable<any> {
    return this.http.post(`${this.baseUrl}/resync`, {});
  }
}
