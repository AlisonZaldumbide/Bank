import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../../modules/main/services/modal.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _modalService: ModalService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this._checkAuth();
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this._authService.isAuthenticated().pipe(take(1));
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this._checkAuth();
  }

  private _checkAuth(): Observable<boolean | UrlTree> {
    return this._authService.isAuthenticated().pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        }

        this._modalService.open({
          title: 'Acceso denegado',
          confirmTitle: 'OK',
          type: 'Error'
        }).subscribe();

        return this._router.parseUrl('/products');
      })
    );
  }
}
