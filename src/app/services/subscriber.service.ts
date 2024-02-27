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

  getPagedAllSubscribers(pageNumber: any, pageSize: any) {
    return this.http.get<any>(
      environment.serverAPI + `Subscriber/GetPagedAllSubscribers?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      // {
      //   headers: new HttpHeaders().append(
      //     'Authorization',
      //     `Bearer ${this.token}`
      //   ),
      // }
    );
   
  }

  registerSubscriber(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + "Authenticate/RegisterSubscriber",
      body
    );
  }

  loginEmailExist(email: any) {
    return this.http.get<any>(
      environment.serverAPI + `Authenticate/LoginEmailExist?email=${email}`,
      email
    );
  }

  deleteUserProfileById(Id: any, aspuId: any) {
    return this.http.delete<any>(
      environment.serverAPI + `Authenticate/DeleteUserProfileById?id=${Id}&aspuid=${aspuId}`,
      this.httpOptions
    );
  }

  deleteAdvertById(Id: any) {
    return this.http.delete<any>(
      environment.serverAPI + `Advert/DeleteAdvertById?id=${Id}`,
      // this.httpOptions
    );
  }

  postInsertNewAdvert(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + "Advert/PostInsertNewAdvert",
      body,
      // this.httpOptions
      // {
      //   headers: new HttpHeaders().append(
      //     "Authorization",
      //     `Bearer ${this.token}`
      //   ),
      // }
    );
  }

  postInsertNewFeedback(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + "Feedback/PostInsertNewFeedback",
      body,
      // this.httpOptions
      // {
      //   headers: new HttpHeaders().append(
      //     "Authorization",
      //     `Bearer ${this.token}`
      //   ),
      // }
    );
  }

  PostDocsForAdvert(formData: any) {

    console.log("formData", formData)
    return this.http.post<any>(
      environment.serverAPI + "FileManager/PostDocsForAdvert",
      formData
    );
  }

  // deleteUserProfileById(Id: any) {
  //   const url = `${environment.serverAPI}/Authenticate/DeleteUserProfileById`;
  //   const params = { Id };
  //   return this.http.delete<any>(url, { params });
  // }


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
