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
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"],
})
export class AddUserComponent implements OnInit {
  
  userForm: FormGroup;
  submitted = false;
  userRole: any;
  currentUrl: any;

  constructor(
    private formBuilder: FormBuilder,
    private api: SubscriberService,
    private apiData: Dataservice,
    private router: Router,

  ) {
    this.userForm = this.formBuilder.group({
      Fullname: ["", Validators.required],
      Username: ["", Validators.required],
      Email: ["", [Validators.required, Validators.email]],
      Password: ["", [Validators.required, this.passwordValidator]],
      UserRole: ["", Validators.required],
    });

    var username: any = sessionStorage.getItem('email');

    var currentUrl: any = this.apiData.getUserUrl();
    const currentUrlObj = JSON.parse(currentUrl);

    if(currentUrlObj){
      if (currentUrlObj === "/admin/adminUser") {
        this.userForm.patchValue({
          UserRole: 'Admin',
        });
      } else {
        this.userForm.patchValue({
          UserRole: 'Subscriber',
        });
      }
    }
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
      Username: this.userForm.controls["Username"].value,
      Email: this.userForm.controls["Email"].value,
      Password: this.userForm.controls["Password"].value,
      UserRole: this.userForm.controls["UserRole"].value,
    };

    this.userRole = body.UserRole;
    if (this.userForm.invalid) {
      return;
    } else {
      this.api.registerSubscriber(body)
      .subscribe((data: any) => {

        this.showSuccessAlert();

        if(this.userRole == 'Admin'){
          this.router.navigate(['/admin/adminUser']);
        } else {
          this.router.navigate(['/admin/subscriberUser']);
        }

        this.apiData.removeUserUrl();
      }, 
      (err) => console.log("error", err)
      );
    }
  }

  onCancel() {
    var currentUrl: any = this.apiData.getUserUrl();
    const currentUrlObj = JSON.parse(currentUrl);
    this.router.navigate([currentUrlObj]);
    this.apiData.removeUserUrl();
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
  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }
}
