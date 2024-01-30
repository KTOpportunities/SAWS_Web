import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { UserLoggedIn } from "../Models/user.model";
import { Admin } from "../Models/admin.model";

interface User {}
@Injectable({
  providedIn: "root",
})
export class Dataservice {
  userInformation: any = "";
  filterSubjectInformantion: any = '';
  private UserInformation = new BehaviorSubject<any>(this.userInformation);
  private filterSubject = new BehaviorSubject<string>(this.filterSubjectInformantion);

  // Observable to which components can subscribe
  filterObservable$ = this.filterSubject.asObservable();

  constructor() {}

  saveCurrentUser(user: UserLoggedIn): string {
    sessionStorage.setItem("CurrentUser", JSON.stringify(user));
    // sessionStorage.setItem("token", user.token);
    return "User Saved";
  }

  getCurrentUser() {
    return sessionStorage.getItem("CurrentUser");
  }

  removeCurrentUser() {
    sessionStorage.removeItem('CurrentUser');
  }

  saveCurrentUserLocal(user: UserLoggedIn): string {
    localStorage.setItem("CurrentUser", JSON.stringify(user));
    return "User Saved";
  }

  getCurrentUserLocal() {
    return localStorage.getItem("CurrentUser");
  }

  removeCurrentUserLocal() {
    localStorage.removeItem('CurrentUser');
  }

  // getToken(): string | null {
  //   return window.sessionStorage.getItem("token");
  // }

  saveUser(user: any) {
    sessionStorage.setItem("UserDetails", JSON.stringify(user));
  }

  getUser() {
    return sessionStorage.getItem("UserDetails");
  }

  removeUser() {
    sessionStorage.removeItem('UserDetails');
  }

  saveUserRole(role: any) {
    sessionStorage.setItem("UserRole", JSON.stringify(role));
  }

  getUserRole() {
    return sessionStorage.getItem("UserRole");
  }

  saveUserUrl(url: any) {
    sessionStorage.setItem("UserUrl", JSON.stringify(url));
  }

  getUserUrl() {
    return sessionStorage.getItem("UserUrl");
  }

  removeUserUrl() {
    sessionStorage.removeItem('UserUrl');
  }

  updateFilter(filter: string) {
    this.filterSubject.next(filter);
  }

}
