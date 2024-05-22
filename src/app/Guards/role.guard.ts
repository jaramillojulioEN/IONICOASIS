import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserServiceService } from 'src/app/services/Users/user-service.service';  

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: UserServiceService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      const expectedRoles: string[] = next.data['expectedRoles'];

    if (!this.authService.isAuth() || !expectedRoles.includes(this.authService.getRol())) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
