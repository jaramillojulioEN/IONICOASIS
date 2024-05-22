import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, UnsubscriptionError } from 'rxjs';
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
      let user = this.authService.getUser()
      let rol : any = this.authService.getRol(user.nombreusuario, user.contraseña)
    if (!this.authService.isAuth() || !(expectedRoles.includes(rol.rol))) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
