import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TokeStorageService } from "src/app/services/token-storage.service";
import { Dataservice } from "src/app/services/data.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class loginComponent implements OnInit {
  userData: any = null;
  loginform: FormGroup;
  errMessage: string = "";
  isChecked: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authApi: AuthService,
    private spinner: NgxSpinnerService,
    private tokenStorage: TokeStorageService,
    private apiData: Dataservice,

  ) {

    this.loginform = this.formBuilder.group({
      Username: [null, Validators.required, this.emailValidator],
      Password: [null, [Validators.required]],
      RememberMe: [false]
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

  login() {
    if (this.loginform.status == "VALID") {
      this.spinner.show();
      this.authApi.login(this.loginform.value).subscribe(
        (data: any) => {

          if(data.userrole === 'Admin'){

            this.tokenStorage.saveToken(data.token);
            this.apiData.saveCurrentUser(data);    
  
            this.router.navigate(['/admin']);  
  
            this.errMessage = "Successfully logged in";
            this.userData = data;
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.errMessage = "Subcriber not allowed to log in";
            setTimeout(() => {
              this.errMessage = "";
            }, 3000);
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
            this.errMessage = "Server Error. please try again later!";
          }
          this.spinner.hide();
        }
      );
      // this.spinner.hide();
    } else {
      this.errMessage = "Please enter your password and username";
      setTimeout(() => {
        this.errMessage = "";
      }, 3000);
    }
  }

  showErrorAlert() {
    Swal.fire({
      icon: "warning",
      title: "Login error!",
      text: "Suscriber role is not allowed to login",
      showConfirmButton: false,
      timer: 3000,
    });
  }

  forgotPassword() {
    this.router.navigate(["forgot-password"]);
  }

  toggleCheckbox() {
    this.isChecked = !this.isChecked;

    console.log("isCheck", this.isChecked)

    if (this.loginform) {
      this.loginform.get('RememberMe')?.setValue(this.isChecked); 
    }
  }
  
}
