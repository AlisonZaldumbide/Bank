import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _authenticated$ = new BehaviorSubject<boolean>(true);

  isAuthenticated(): Observable<boolean> {
    return this._authenticated$.asObservable();
  }

  setAuthenticated(value: boolean): void {
    this._authenticated$.next(value);
  }
}
