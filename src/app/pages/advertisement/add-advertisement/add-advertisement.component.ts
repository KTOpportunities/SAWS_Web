import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { SubscriberService } from "../../../services/subscriber.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { Dataservice } from "src/app/services/data.service";

@Component({
  selector: 'app-add-advertisement',
  templateUrl: './add-advertisement.component.html',
  styleUrls: ['./add-advertisement.component.css']
})
export class AddAdvertisementComponent implements OnInit {

  userForm: FormGroup;
  submitted = false;
  userRole: any;
  currentUrl: any;
  passwordVisibility: boolean = false;
  isPasswordNotEmpty: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private api: SubscriberService,
    private apiData: Dataservice,
    private router: Router,

  ) {
    this.userForm = this.formBuilder.group({
      Fullname: ["", Validators.required],
      Username: [""],
      Email: ["", [Validators.required, Validators.email]],
      Password: ["", [Validators.required, this.passwordValidator]],
      UserRole: ["", Validators.required],
    });
  }

  ngOnInit() {}

  emailValidator(control: any) {
    if (control.value) {
      const emailRegex =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

      if (emailRegex.test(control.value)) {
        return null; // Valid email format
      } else {
        return { invalidEmail: true, invalidFormat: true }; // Invalid email format
      }
    } else {
      return null;
    }     
  }

  togglePasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }

  onPasswordInput(event: any) {
    this.isPasswordNotEmpty = event.target.value.trim().length > 0;

    if (!this.isPasswordNotEmpty) {
      this.passwordVisibility = false;
    }
  }

  passwordValidator(control: AbstractControl) {
    const value = control.value;
    // Check if the password contains at least one letter and one number
    const containsLetter = /[a-zA-Z]/.test(value);
    const containsNumber = /\d/.test(value);

    return containsLetter && containsNumber ? null : { invalidPassword: true };
  }

  onSubmit() {
    this.submitted = true;
    var body = {
      Fullname: this.userForm.controls["Fullname"].value,
      Email: this.userForm.controls["Email"].value,
      Username: this.userForm.controls["Email"].value,
      Password: this.userForm.controls["Password"].value,
      UserRole: this.userForm.controls["UserRole"].value,
    };

    this.userRole = body.UserRole;
    if (this.userForm.invalid) {
      return;
    } else {
      
      this.api.loginEmailExist(body.Email).subscribe(
        (data) => {

          if(!data) {
            this.saveUserForm(body);

          } else {
            this.showExistingEmailAlert()
          }
        },
        (error) => {
          console.error(error);
        }
      );    

    }
  }

  saveUserForm(body: any){
    this.api.registerSubscriber(body)
      .subscribe((data: any) => {

        this.showSuccessAlert();

        this.router.navigate(['/admin/advertisement']);
      }, 
      (err) => console.log("error", err)
      );
  }

  onCancel() {
    this.router.navigate(['/admin/advertisement']);
  }

  showSuccessAlert() {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "You added new user successfully.",
    });
  }

  showUnsuccessfulAlert() {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Something went wrong. Please try again.",
    });
  }

  showExistingEmailAlert() {
    Swal.fire({
      icon: "warning",
      // title: "Email exist!",
      text: "Email already exist!",
      showConfirmButton: false,
      timer: 2500,

    });
  }
  
  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }
}
