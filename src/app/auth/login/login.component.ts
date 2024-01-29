import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TokeStorageService } from "src/app/services/token-storage.service";
import { Dataservice } from "src/app/services/data.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class loginComponent implements OnInit {
  userData: any = null;
  loginform: FormGroup;
  submitted = false;
  errMessage: string = "";

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authApi: AuthService,
    private spinner: NgxSpinnerService,
    private tokenStorage: TokeStorageService,
    private apiData: Dataservice,

  ) {
    this.loginform = this.formBuilder.group({
      Username:["", Validators.required],
      Password: ["", Validators.required],
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

  login()
   {
      this.submitted = true;
      debugger;
      var body = {
        Username: this.loginform.controls['Username'].value,
        Password: this.loginform.controls['Password'].value
      }
      

    if (this.loginform.status == "VALID") {
      this.spinner.show();
      this.authApi.login(this.loginform.value).subscribe(
        (data: any) => {


          this.tokenStorage.saveToken(data.token);
          this.apiData.saveCurrentUser(data);         


          this.router.navigate(['/admin']);


          this.errMessage = "Successfully logged in";
          this.userData = data;
          this.spinner.hide();
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
      // this.spinner.hide();
    }
  }

  forgotPassword() {
    this.router.navigate(["forgot-password"]);
  }
}
