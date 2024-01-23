import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TokeStorageService } from "src/app/services/token-storage.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class loginComponent implements OnInit {
  userData: any = null;
  loginform: FormGroup;
  errMessage: string = "";
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authApi: AuthService,
    private spinner: NgxSpinnerService,
    private tokenStorage: TokeStorageService
  ) {
    this.loginform = this.formBuilder.group({
      Username: [null, Validators.required, this.emailValidator],
      Password: [null, [Validators.required]],
    });

    var username: any = sessionStorage.getItem('email');

    if(username){
      this.loginform.patchValue({
        Username: username,
      });
      
      sessionStorage.removeItem('email')
    }
  }
  ngOnInit(): void {
    debugger;
  }
  async emailValidator(control: any) {
    if (control.value) {
      const matches = control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      );
      return matches ? null : { invalidEmail: true };
    } else {
      return null;
    }
  }
  login() {
    debugger;

    if (this.loginform.status == "VALID") {
      this.spinner.show();
      this.authApi.login(this.loginform.value).subscribe(
        (data: any) => {
          debugger;
          console.log("LOGINS", data);
          // if (
          //   data.Status == "200" &&
          //   data.Message == "Successfully Signed In"
          // ) {

          this.tokenStorage.saveToken(data.token);
          this.router.navigate(['/admin']);
          this.errMessage = "Successfully logged in";
          this.userData = data;

          // data.saveCurrentUser(data);
          // }
        },
        (err) => {
          console.log(err);
          if (
            err.error.Status == "401" &&
            err.error.Message == "Please check your password and username"
          ) {
            this.errMessage = err.error.Message;
          } else {
            this.errMessage = "Server Error. please try again later!";
          }
          this.spinner.hide();
        }
      );
    }
  }

  forgotPassword() {
    this.router.navigate(["forgot-password"]);
  }
}
