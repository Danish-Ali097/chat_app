import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, take } from 'rxjs';

export const routeGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isLoggedIn$.pipe(
    take(1), // Take only the first emitted value
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      }

      // Redirect to login if not logged in
      router.navigate(['/login']);
      return false;
    })
  );
};
