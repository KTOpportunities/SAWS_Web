import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class loginComponent implements OnInit {
  loginform: FormGroup;
  message: string = "";
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authApi: AuthService
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
    debugger;

    if (this.loginform.status == "VALID") {
      this.authApi.login(this.loginform.value).subscribe(
        (data:any) => {
          if (
            data.Status == "200" &&
            data.Message == "Successfully Signed In"
          ) {
            this.router.navigate(['/admin']);
            this.message = data.Message;
          } else {
            debugger;
            if (data.Message == "Bad request was made") {
              this.message = "User does not exist";
            } else {
              this.message = data.Message;
            }
          }
      },
      (err) => {
        console.log(err);
        debugger
      });
    }
  }

  forgotPassword() {
    this.router.navigate(["forgot-password"]);
  }
}
