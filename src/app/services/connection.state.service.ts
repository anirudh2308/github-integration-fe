import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConnectionStateService {
  private connected$ = new BehaviorSubject<boolean>(false);
  isConnected$ = this.connected$.asObservable();

  setConnected(state: boolean) {
    this.connected$.next(state);
  }
}