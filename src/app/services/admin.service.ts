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
export class AdminService {
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

  GetPagedAllAdmins(pageNumber: any, pageSize: any) {
    return this.http.get<any>(
      environment.serverAPI + `Admin/GetPagedAllAdmins?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  }

  GetPagedAllFeedbacks(pageNumber: any, pageSize: any) {
    return this.http.get<any>(
      environment.serverAPI + `Feedback/GetPagedAllFeedbacks?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  }

  GetPagedAllBroadcasts(pageNumber: any, pageSize: any) {
    return this.http.get<any>(
      environment.serverAPI + `Feedback/GetPagedAllBroadcasts?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  }

  getPagedAllFeedbacksByUniqueEmail(pageNumber: any, pageSize: any) {
    return this.http.get<any>(
      environment.serverAPI + `Feedback/GetPagedAllFeedbacksByUniqueEmail?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  }

  getBroadcastMessages() {
    return this.http.get<any>(
      environment.serverAPI + `Feedback/GetBroadcastMessages`,
    );
  }

  GetPagedAllAdverts(pageNumber: any, pageSize: any) {
    return this.http.get<any>(
      environment.serverAPI + `Advert/GetPagedAllAdverts?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  }

  // createNewUser(body: {}) {
  //   return this.http.post<any>(
  //     environment.serverAPI + "Authenticate/RegisterSubscriber",
  //     body
  //   );
  // }

  getAdvertByAdvertId(Id: any) {
    return this.http.get<any>(
      environment.serverAPI + `Advert/GetAdvertByAdvertId?Id=${Id}`,
      
    );
  }

  getFeedbackById(Id: any) {
    return this.http.get<any>(
      environment.serverAPI + `Feedback/GetFeedbackById?Id=${Id}`,
      
    );
  }

  // deleteUserProfileById(Id: any) {
  //   const url = `${environment.serverAPI}/Authenticate/DeleteUserProfileById`;
  //   const params = { Id };
  //   return this.http.delete<any>(url, { params });
  // }

  // InsertUpdateUserProfile(body: {}) {
  //   return this.http.post<any>(
  //     environment.serverAPI + "Authenticate/InsertUpdateUserProfile",
  //     body,
  //     this.httpOptions
  //     // {
  //     //   headers: new HttpHeaders().append(
  //     //     "Authorization",
  //     //     `Bearer ${this.token}`
  //     //   ),
  //     // }
  //   );
  // }
}
