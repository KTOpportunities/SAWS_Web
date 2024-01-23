import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { UserLoggedIn } from "../Models/user.model";

interface User {}
@Injectable({
  providedIn: "root",
})
export class Dataservice {
  userInformation: any = "";
  private UserInformation = new BehaviorSubject<any>(this.userInformation);

  constructor() {}
  saveCurrentUser(user: UserLoggedIn): string {
    debugger;
    sessionStorage.setItem("User", JSON.stringify(user));
    sessionStorage.setItem("token", user.token);
    return "User Saved";
  }
  getCurrentUser() {
    return sessionStorage.getItem("User");
  }
  getToken(): string | null {
    return window.sessionStorage.getItem("token");
  }
}
