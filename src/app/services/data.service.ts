import { ElementRef, Injectable, ViewChild } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { UserLoggedIn } from "../Models/user.model";
import { Admin } from "../Models/admin.model";
import { FormGroup } from "@angular/forms";

interface User {}
@Injectable({
  providedIn: "root",
})
export class Dataservice {
  private form!: FormGroup;

  userInformation: any = "";
  private UserInformation = new BehaviorSubject<any>(this.userInformation);
  filterSubjectInformantion: any = '';
  private filterSubject = new BehaviorSubject<string>(this.filterSubjectInformantion);
  private userSubject = new BehaviorSubject<any | null>(null);
  private feedbackSubject = new BehaviorSubject<any | null>(null);
  
  // Observable to which components can subscribe
  filterObservable$ = this.filterSubject.asObservable();  
  public userObservable$ = this.userSubject.asObservable();
  public feedbackObservable$ = this.feedbackSubject.asObservable();
  
  constructor() {
    
 // Initialize value from sessionStorage
    const storedValue = this.getCurrentUser();
    if (storedValue) {
      const parsedValue: any = JSON.parse(storedValue);
      this.userSubject.next(parsedValue);
    }
  }

  setFeedbackData(data: any): void {
    this.feedbackSubject.next(data);
  }

  getFeedbackData(): Observable<any> {
    return this.feedbackObservable$;
  }

  saveCurrentUser(user: UserLoggedIn): string {
    sessionStorage.setItem("CurrentUser", JSON.stringify(user));
    this.userSubject.next(user);
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

  saveUser(user: any) {
    sessionStorage.setItem("UserDetails", JSON.stringify(user));
  }

  getUser() {
    return sessionStorage.getItem("UserDetails");
  }

  removeUser() {
    sessionStorage.removeItem('UserDetails');
  }

  saveAdvert(advert: any) {
    sessionStorage.setItem("AdvertDetails", JSON.stringify(advert));
  }

  getAdvert() {
    return sessionStorage.getItem("AdvertDetails");
  }

  removeAdvert() {
    sessionStorage.removeItem('AdvertDetails');
  }

  saveFeedback(feeback: any) {
    sessionStorage.setItem("FeedbackDetails", JSON.stringify(feeback));
  }

  getFeedback() {
    return sessionStorage.getItem("FeedbackDetails");
  }

  removeFeedback() {
    sessionStorage.removeItem('FeedbackDetails');
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

  clearFilter() {
    this.filterSubject.next('');
  }

  setForm(form: FormGroup) {
    this.form = form;
  }

  clearForm() {
    if (this.form) {
      this.form.reset();
    }
  }
}
