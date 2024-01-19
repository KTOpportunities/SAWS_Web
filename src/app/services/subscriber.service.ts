import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environment";
import { from } from "rxjs";

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
  constructor(private http: HttpClient) {}

  getPagedAllSubscribers() {
    return this.http.get<any>(
      environment.serverAPI + "Subscriber/GetPagedAllSubscribers"
    );
  }
  createNewUser(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + 'Authenticate/RegisterSubscriber',
      body
    );
  }
}
