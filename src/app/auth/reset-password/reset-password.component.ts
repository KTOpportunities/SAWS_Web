import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './../../services/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
// import { ResetConfirmPassword } from 'src/app/models/resetPassword';


// interface ResetPassword{
//   email: string;
//   token: string;
//   newPassword: string;
//   confirmPassword: string;
// }

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css'],
  })

export class resetPasswordComponent implements OnInit {
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false;
  resetPasswordForm :FormGroup;
  email: string | null = null;
  token: string| null = null;
  sharedObject: any;
  submitted: boolean = false;

  // resetPassword : ResetConfirmPassword = {
  //   email: '',
  //   token: '',
  //   newPassword: '',
  //   confirmPassword: '',
  // };
  
    constructor(private router:Router,
      private api: AuthService,
      private formBuilder: FormBuilder,
    ){
      this.resetPasswordForm = this.formBuilder.group({
        email: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword:['', Validators.required],
      });
    }

    ngOnInit(): void {

      this.submitted = true;
      const urlSegments = this.router.url.split('=');

      if (urlSegments.length >= 2) {
        this.email = urlSegments[1].split('&')[0];
        sessionStorage.setItem('email', `${this.email}`);
        this.resetPasswordForm.patchValue({
          email: this.email,
        });
      }
    }

    // onResetPasswordSubmit() {

    //   if(this.resetPasswordForm.valid){
        
    //     this.resetPassword = {
    //       email: this.resetPasswordForm?.value.email,
    //       token: this.router.url.split('token=')[1],
    //       newPassword: this.resetPasswordForm?.value.newPassword,
    //       confirmPassword: this.resetPasswordForm?.value.confirmPassword,
    //     }

    //     this.api.resetPassword(this.resetPassword).subscribe({
    //       next:(response) => {
    //       this.showSuccessAlert();

    //       setTimeout(() => {
    //         this.navigateto('/Login');
    //       }, 2000);

    //     },
    //       error:(err: any) => {
    //         console.log(err)
    //         this.alertMessage("Error with provided credentials")
    //       },
    //     })
    //   } else {
    //       this.showFormErrorsAlert()
    //   }
    // }

    navigateto(page: string) {
      this.router.navigate([page]);
    }

    back() {
      this.router.navigate(['/forgot-password']);
    }

    alertMessage(message: string) {
      Swal.fire({
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 2000,
      });
    }

    showSuccessAlert() {
      Swal.fire({
        icon: 'success',
        title: 'Password Reset!',
        text: "Password reset successful",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    showFormErrorsAlert() {
      Swal.fire({
        icon: 'error',
        title: 'Validation errors!',
        text: 'Form has errors!',
      });
    }
  }
