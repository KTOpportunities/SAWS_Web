import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class loginComponent implements OnInit {
  loginform: FormGroup;
  errMessage: string = "";
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authApi: AuthService,
    private spinner: NgxSpinnerService
  ) {
    this.loginform = this.formBuilder.group({
      Username: [null, Validators.required, this.emailValidator],
      Password: [null, [Validators.required]],
    });
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
    this.spinner.show();
    let elem:any = document.getElementById("message");
    if (this.loginform.status == "VALID") {
      this.authApi.login(this.loginform.value).subscribe(
        (data: any) => {
          if (
            data.Status == "200" &&
            data.Message == "Successfully Signed In"
            
          ) {
            this.router.navigate(["/admin"]);
            this.errMessage = data.Message;
            elem.style.display="block";
            // this.spinner.hide();
          }
        },
        (err) => {
          console.log(err);
          if (
            err.error.Status == "401" &&
            err.error.Message == "Please check your password and username"
          ) {
            this.errMessage = err.error.Message;
          } else {
            this.errMessage = err.error.Message;
          }
          elem.style.display="block";
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
          
          debugger;

        }
      );
    }
  }

  forgotPassword() {
    this.router.navigate(["forgot-password"]);
  }
}
