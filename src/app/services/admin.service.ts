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
      // {
      //   headers: new HttpHeaders().append(
      //     'Authorization',
      //     `Bearer ${this.token}`
      //   ),
      // }
    );
  }

  // createNewUser(body: {}) {
  //   return this.http.post<any>(
  //     environment.serverAPI + "Authenticate/RegisterSubscriber",
  //     body
  //   );
  // }

//   deleteUserProfileById(Id: any) {
//     return this.http.delete<any>(
// environment.serverAPI + `Authenticate/deleteUserProfileById?Id=${Id}`,this.httpOptions
//     );
//   }

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
