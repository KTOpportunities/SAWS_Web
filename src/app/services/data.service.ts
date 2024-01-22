import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { UserLoggedIn } from 'src/models/user.model';

interface User {}
@Injectable({
  providedIn: 'root',
})

export class DataService {
  // userInformation: any = '';
  private sharedObject: any;
  // private UserInformation = new BehaviorSubject<any>(this.userInformation);

  constructor() {}
  // saveCurrentUser(user: UserLoggedIn): string {
  //   sessionStorage.setItem('User', JSON.stringify(user));
  //   sessionStorage.setItem('token', user.DetailDescription.token);
  //   return 'User Saved';
  // }
  // getCurrentUser() {
  //   return sessionStorage.getItem('User');
  // }
  // getToken(): string | null {
  //   return window.sessionStorage.getItem('token');
  // }

  setSharedObject(obj: any): void {
    this.sharedObject = obj;
  }

  getSharedObject(): any {
    return this.sharedObject;
  }
}
