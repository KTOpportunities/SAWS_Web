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
export class AuthService {
  loginBody: loginform = {
    Username: "",
    Password: "",
  };

  constructor(private http: HttpClient) {}

  login(form: loginform) {
    return this.http.post<any>(
      environment.serverAPI + "Authenticate/login",
      form
    );
  }
  requestPasswordReset(form: any){
    this.body.email = form.username;
    debugger
    return this.http.post<any>(environment.serverAPI + `Authenticate/RequestPasswordReset?email=${this.body.email}`, this.body.email);
  }
  

  RequestPasswordReset(form: any) {
    return this.http.post<any>(
      environment.serverAPI + `Authenticate/RequestPasswordReset?email=${form.Email}`,
      form
    ).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }


}
