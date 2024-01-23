import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { environment } from "../../../environment";
import { from } from "rxjs";
import { Dataservice } from "./data.service";

interface loginform {
  Username: string;
  Password: string;
}
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }),
};

@Injectable({
  providedIn: "root",
})
export class SubscriberService {
  User: any;
  token: any;
  constructor(private http: HttpClient) {
    var stringUser = sessionStorage.getItem("Users");

    if (stringUser) {
      this.User = JSON.parse(stringUser);
      this.token = this.User.token;
    }
  }
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }),
  };

  getPagedAllSubscribers() {
    return this.http.get<any>(
      environment.serverAPI + "Subscriber/GetPagedAllSubscribers"
    );
  }
  createNewUser(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + "Authenticate/RegisterSubscriber",
      body
    );
  }

  InsertUpdateUserProfile(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + "Authenticate/InsertUpdateUserProfile",
      body,
      this.httpOptions
      // {
      //   headers: new HttpHeaders().append(
      //     "Authorization",
      //     `Bearer ${this.token}`
      //   ),
      // }
    );
  }
}
