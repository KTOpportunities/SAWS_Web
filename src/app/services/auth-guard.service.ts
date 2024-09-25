import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthGuardHelperService } from './auth-guard-helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  currentPath:string = "";
  constructor(public authInt: AuthGuardHelperService, public router: Router) {}
  canActivate(): boolean {
    if (!this.authInt.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
  this.currentPath = window.location.href;
  const parts = this.currentPath.split('admin/')[1];
  sessionStorage.setItem("currentPath",parts);
    return true;
  }
}
