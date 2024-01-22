import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { FormBuilder, Validators, AbstractControl, FormGroup } from '@angular/forms';




interface ResetPassword{
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css'],
  })

export class resetPasswordComponent implements OnInit {


  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false;
  // blurEffect: boolean;
  resetPasswordForm :FormGroup;
  email: string | null = null;
  token: string| null = null;
  ResetPassword : ResetPassword = {
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: '',
  };

  
    constructor(private router:Router,
      private authAPI: AuthService,
      private formBuilder: FormBuilder
    ){
      this.resetPasswordForm = this.formBuilder.group({
        newPassword: [null,Validators.required],
        confirmPassword:[null,Validators.required],
      });
    }
    ngOnInit(): void {
     
    }
    
    resetPassword() {
      this.successMessage = '';
      
      // show loading indicator
      this.loading = true;
    
      const urlSegments = this.router.url.split('=');
      if (urlSegments.length >= 2) {
        this.email = urlSegments[1].split('&')[0];
        this.token = this.router.url.split('token=')[1];
    
        this.ResetPassword  = {
          email: this.email,
          token: this.token,
          newPassword: this.resetPasswordForm?.value.newPassword,
          confirmPassword: this.resetPasswordForm?.value.confirmPassword,
        };
    
        // Check if form is valid including custom validator
        if (this.resetPasswordForm.valid) {
          this.authAPI.RequestPasswordReset(this.ResetPassword ).subscribe({
            next: (data) => {
              this.loading = false;
              this.errorMessage = '';
              this.successMessage = 'Your password has been successfully updated!';
              this.resetPasswordForm.reset();
              setTimeout(() => {
                this.successMessage = '';
                this.router.navigate(['/login']);
              }, 4000);
            },
            error: (error) => {
              this.errorMessage = 'Error: Invalid credentials provided!';
              this.loading = false;
              setTimeout(() => {
                this.errorMessage = '';
              }, 3000);
            },
          });
        } else {
          this.loading = false;
          this.errorMessage = 'Please provide a password!';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      } else {
        // Handle the case where the URL structure is unexpected
        console.error('Invalid URL structure:', this.router.url);
      }
    }
    
    
    Resetpassword(){
        this.router.navigate(['reset-password']);
    }
  }
