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

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"],
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  submitted = false;
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
  constructor(
    private formBuilder: FormBuilder,
    private api: SubscriberService
  ) {
    this.userForm = this.formBuilder.group({
      Fullname: ["", Validators.required],
      Username: ["", Validators.required],
      Email: ["", [Validators.required, Validators.email]],
      Password: ["", [Validators.required, this.passwordValidator]],
      UserRole: ["", Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;

    debugger;
    var body = {
      Fullname: this.userForm.controls["Fullname"].value,
      Username: this.userForm.controls["Username"].value,
      Email: this.userForm.controls["Email"].value,
      Password: this.userForm.controls["Password"].value,
      UserRole: this.userForm.controls["UserRole"].value,
    };
    debugger;
    console.log("BODY:", body);
    if (this.userForm.invalid) {
      debugger;
      return;
    } else {
      this.api.createNewUser(body).subscribe((data: any) => {
        debugger;
        console.log("SAVED:", data);
        // this.nextStep();
        if (data.Status === "Success") {
          debugger;
          this.showSuccessAlert();
        }
      });
    }
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
