import { Injectable, signal } from '@angular/core';
import { fromEvent, map, merge } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  private _isOnline = signal<boolean>(navigator.onLine);
  public readonly isOnline$ = this._isOnline.asReadonly();

  constructor() {
    merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).subscribe((isOnline) => {
      this._isOnline.set(isOnline);
    });
  }
}
