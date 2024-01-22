import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './../../services/auth.service';
import { FormBuilder, Validators, AbstractControl, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ResetConfirmPassword } from 'src/app/models/resetPassword';
import { DataService } from 'src/app/services/data.service';


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

  resetPassword : ResetConfirmPassword = {
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: '',
  };
  
    constructor(private router:Router,
      private api: AuthService,
      private formBuilder: FormBuilder,
      private dataService: DataService
    ){
      this.resetPasswordForm = this.formBuilder.group({
        email: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword:['', Validators.required],
      });
    }

    ngOnInit(): void {

      this.submitted = true;
      this.sharedObject = this.dataService.getSharedObject();

      if (this.sharedObject && this.sharedObject.resetUrl) {
        const urlSegments = this.sharedObject.resetUrl.split('=');

        this.email = urlSegments[1].split('&')[0];
        console.log('this.email', this.email)

        this.resetPasswordForm.patchValue({
          email: this.email,
        });
      }
    }

    onResetPasswordSubmit() {

      if(this.resetPasswordForm.valid){
        
        this.resetPassword = {
          email: this.resetPasswordForm?.value.email,
          token: this.sharedObject.resetToken,
          newPassword: this.resetPasswordForm?.value.newPassword,
          confirmPassword: this.resetPasswordForm?.value.confirmPassword,
        }

        this.api.resetPassword(this.resetPassword).subscribe({
          next:(response) => {
          this.showSuccessAlert();
            this.navigateto('/Login');
          },
          error:(err) => {
            console.log(err)
            this.alertMessage("Error with provided credentials")
          },
        })
      } else {
          this.showFormErrorsAlert()
      }
    }

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
