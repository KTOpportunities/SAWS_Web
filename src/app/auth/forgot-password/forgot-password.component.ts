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
    successMessage: string | null = null;
    loading = false;
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
    constructor(private formBuilder: FormBuilder, private api: AuthService) {
      this.userForm = this.formBuilder.group({
        Email: ['', [Validators.required, this.emailValidator]],
      });
    }
    emailValidator(control: any) {
      if (control.value) {
        const matches = control.value.match(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        );
        return matches ? null : { invalidEmail: true };
      } else {
        return null;
      }
    }
    onSubmit() {
      this.submitted = true;
      debugger;
      var body = {
        Email: this.userForm.controls['Email'].value,
      };
      debugger;
      console.log('BODY:', body);
      if (this.userForm.invalid) {
        debugger;
        return;
      } else {
        this.api.RequestPasswordReset(body).subscribe((data: any) => {
          debugger;
          console.log('SAVED:', data);
          // this.nextStep();
         
            
            this.showSuccessAlert();
            this.statusMessage = true;
          
        });
      }
    }
    showSuccessAlert() {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Thank you! Check Your Email For Password Reset!.',
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
      console.log('Form submitted!');
    }
  
  
  
  
  
  
  
  }