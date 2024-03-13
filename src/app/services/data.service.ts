import { ElementRef, Injectable, ViewChild } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { UserLoggedIn } from "../Models/user.model";
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
  private broadcastSubject = new BehaviorSubject<any | null>(null);  
  private advertSubject = new BehaviorSubject<any | null>(null);
  
  // Observable to which components can subscribe
  filterObservable$ = this.filterSubject.asObservable();  
  public userObservable$ = this.userSubject.asObservable();
  public feedbackObservable$ = this.feedbackSubject.asObservable();
  public broadcastObservable$ = this.broadcastSubject.asObservable();
  public advertObservable$ = this.advertSubject.asObservable();
  
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

  setAdvertData(data: any): void {
    this.feedbackSubject.next(data);
  }

  getAdvertData(): Observable<any> {
    return this.advertObservable$;
  }

  setBroadcastData(data: any): void {
    this.advertSubject.next(data);
  }

  getBroadcastData(): Observable<any> {
    return this.broadcastObservable$;
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

  // saveAdvert(advert: any) {
  //   sessionStorage.setItem("AdvertDetails", JSON.stringify(advert));
  // }

  // getAdvert() {
  //   return sessionStorage.getItem("AdvertDetails");
  // }

  // removeAdvert() {
  //   sessionStorage.removeItem('AdvertDetails');
  // }

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

  getFileType(fileMimetype: string): string {
    const videoMimeTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-ms-wmv"];
    const imageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/jpg"];
    const audioMimeTypes = ["audio/mpeg", "audio/mp4", "audio/ogg", "audio/wav",  "audio/mp3"];

    if (videoMimeTypes.includes(fileMimetype)) {
      return "Video";
    } else if (imageMimeTypes.includes(fileMimetype)) {
      return "Image";
    } else if (audioMimeTypes.includes(fileMimetype)) {
      return "Audio";
    } else {
      return "Unknown";
    }
  }
}
