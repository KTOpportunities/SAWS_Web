import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService} from '././../../services/auth.service' 
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
// import { DataService } from 'src/app/services/data.service';

interface ResetPassword{
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css'],
  })

  export class forgotPasswordComponent implements OnInit{

    currentStep: number = 1;
    userForm: FormGroup;
    submitted = false;
    errorMessage: string | null = null;
    email: string | null = null;
    successMessage: string | null = null;
    loading = false;
    resetRequestSuccessful = false;
    statusMessage = false;

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
      // Adjust your layout here based on the window size
    }
    @ViewChild('content') content!: ElementRef;
    // Call this method when the keyboard is opened
    scrollContent(): void {
      this.content.nativeElement.scrollIntoView();
    }
    constructor(
      private formBuilder: FormBuilder, 
      private api: AuthService,
      private router: Router,
      // private dataService: DataService
      
      ) {
      this.userForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
      });
    }


    onSubmit() {
      this.submitted = true;

      this.email = this.userForm.value.email;

      //  Check if the form is valid before submitting
      if (this.userForm.valid) {
        this.api.requestPasswordReset(this.userForm.value).subscribe({
          next:(response) => {
            this.showSuccessAlert();

            setTimeout(() => {
              this.resetRequestSuccessful = true;
            }, 2000);

          },
          error:(err) => {
            console.log(err)
            this.alertMessage(err.error.response)
          },
        })
      } else {
        // this.showFormErrorsAlert();
      }
    }

    onBack(){
      this.router.navigate(['/Login']);
    }

    navigateto(page: string) {
      this.router.navigate([page]);
    }

    showSuccessAlert() {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Thank you! Check Your Email For Password Reset!',
        showConfirmButton: false,
        timer: 2000,
      });
    }

    alertMessage(message: string) {
      Swal.fire({
        icon: "warning",
        title: message,
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

    showUnsuccessfulAlert() {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong. Please try again.',
      });
    }

    onReset() {
      this.submitted = false;
      this.userForm.reset();
    }

    ngOnInit() {}

    nextStep() {
      this.currentStep++;
    }

    prevStep() {
      this.currentStep--;
    }

    submitForm() {
      this.showSuccessAlert();

    } 
  }