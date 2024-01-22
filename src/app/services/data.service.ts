import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { UserLoggedIn } from 'src/models/user.model';

interface User {}
@Injectable({
  providedIn: 'root',
})

export class DataService {
  private sharedObject: any;

  constructor() {}

  setSharedObject(obj: any): void {
    this.sharedObject = obj;
  }

  getSharedObject(): any {
    return this.sharedObject;
  }
}
