import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokeStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardHelperService {

  constructor(public jwtHelper: JwtHelperService, private tokenStorageService: TokeStorageService,) {}
  // ...
  public isAuthenticated(): boolean {
    const token = this.tokenStorageService.getToken()!;
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }
}
