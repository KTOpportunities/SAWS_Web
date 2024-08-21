import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TokeStorageService } from "src/app/services/token-storage.service";
import { Dataservice } from "src/app/services/data.service";
import Swal from "sweetalert2";
import { ElementRef } from "@angular/core";

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
  passwordVisibility: boolean = false;
  isPasswordNotEmpty: boolean = false;
  isChecked: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authApi: AuthService,
    private spinner: NgxSpinnerService,
    private tokenStorage: TokeStorageService,
    private apiData: Dataservice,
    private el: ElementRef
  ) {
    this.loginform = this.formBuilder.group({
      Username: [null, Validators.required, this.emailValidator],
      Password: [null, [Validators.required]],
      RememberMe: [false],
    });

    var username: any = sessionStorage.getItem("email");

    if (username) {
      this.loginform.patchValue({
        Username: username,
      });

      sessionStorage.removeItem("email");
    }
  }
  ngOnInit(): void {}

  togglePasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }

  onPasswordInput(event: any) {
    this.isPasswordNotEmpty = event.target.value.trim().length > 0;

    if (!this.isPasswordNotEmpty) {
      this.passwordVisibility = false;
    }
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
    this.submitted = true;
    var body = {
      Username: this.loginform.controls["Username"].value,
      Password: this.loginform.controls["Password"].value,
    };

    if (this.loginform.status == "VALID") {
      this.spinner.show();
      this.authApi.login(this.loginform.value).subscribe(
        (data: any) => {
          if (data.isAdmin) {
            this.tokenStorage.saveToken(data.token);
            this.getLoggedInUser(data.aspUserId);
            this.userData = data;
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.errMessage = "Account not allowed to access portal";
            setTimeout(() => {
              this.errMessage = "";
            }, 4000);
          }
        },
        (err) => { 
          this.errMessage = err.error.errorMessages;
          this.spinner.hide();
        }
      );
    } else {
      this.errMessage = "Please enter your password and username";
      setTimeout(() => {
        this.errMessage = "";
      }, 4000);
    }
  }

  getLoggedInUser(Id: string) {
    this.authApi.getLoggedInUser(Id).subscribe(
      (data: any) => {
        this.apiData.saveCurrentUser(data);
        this.router.navigate(["/admin"]);
      },
      (err) => {
        // console.log(err);
      }
    );
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

    if (this.loginform) {
      this.loginform.get("RememberMe")?.setValue(this.isChecked);
    }
  }
}
