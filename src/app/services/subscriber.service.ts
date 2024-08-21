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
      environment.serverAPI +
        `v1/Subscribers/GetPagedAllSubscribers?pageNumber=${pageNumber}&pageSize=${pageSize}`
      // {
      //   headers: new HttpHeaders().append(
      //     'Authorization',
      //     `Bearer ${this.token}`
      //   ),
      // }
    );
  }

  registerAdmin(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + "v1/Authenticate/RegisterAdmin",
      body
    );
  }

  registerSubscriber(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + "v1/Authenticate/RegisterSubscriber",
      body
    );
  }

  loginEmailExist(email: any) {
    return this.http.get<any>(
      environment.serverAPI + `v1/Authenticate/LoginEmailExist?email=${email}`,
      email
    );
  }

  deleteUserProfileById(Id: any) {
    return this.http.delete<any>(
      environment.serverAPI +
        `v1/Authenticate/DeleteUserProfileById?id=${Id}`,
      this.httpOptions
    );
  }

  deleteAdvertById(Id: any) {
    return this.http.delete<any>(
      environment.serverAPI + `v1/Adverts/DeleteAdvertById?id=${Id}`
      // this.httpOptions
    );
  }

  deleteFeedbackById(Id: any) {
    return this.http.delete<any>(
      environment.serverAPI + `v1/Feedbacks/DeleteFeedbackById?id=${Id}`
      // this.httpOptions
    );
  }

  DeleteBroadcastByBatchId(batchId: any) {
    return this.http.delete<any>(
      environment.serverAPI +
        `v1/Feedbacks/DeleteBroadcastByBatchId?batchId=${batchId}`
      // this.httpOptions
    );
  }

  postInsertNewAdvert(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + "v1/Adverts/PostInsertNewAdvert",
      body
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
      environment.serverAPI + "v1/Feedbacks/PostInsertNewFeedback",
      body
      // this.httpOptions
      // {
      //   headers: new HttpHeaders().append(
      //     "Authorization",
      //     `Bearer ${this.token}`
      //   ),
      // }
    );
  }

  postInsertBroadcastMessages(feedbackList: any[]) {
    return this.http.post<any>(
      environment.serverAPI + "v1/Feedbacks/PostInsertBroadcastMessages",
      feedbackList
    );
  }

  PostDocsForAdvert(formData: any) {
    return this.http.post<any>(
      environment.serverAPI + "v1/FileManager/PostDocsForAdvert",
      formData
    );
  }

  PostDocsForFeedback(formData: any) {
    return this.http.post<any>(
      environment.serverAPI + "v1/FileManager/PostDocsForFeedback",
      formData
    );
  }

  // deleteUserProfileById(Id: any) {
  //   const url = `${environment.serverAPI}/Authenticate/DeleteUserProfileById`;
  //   const params = { Id };
  //   return this.http.delete<any>(url, { params });
  // }

  UpdateUserProfile(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + "v1/Authenticate/UpdateUserProfile",
      body,
      this.httpOptions
    );
  }

  GetRegistrationsPerUserType() {
    return this.http.get<any>(
      environment.serverAPI + `v1/Lookup/GetRegistrationsPerUserType`
    );
  }
  GetAdvertsClickPerMonth() {
    return this.http.get<any>(
      environment.serverAPI + `v1/Lookup/GetAdvertsClickPerMonth`
    );
  }
  GetSubscriptionsPerPackageType() {
    return this.http.get<any>(
      environment.serverAPI + `v1/Lookup/GetSubscriptionsPerPackageType`
    );
  }



}
