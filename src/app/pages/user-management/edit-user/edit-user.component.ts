import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Admin } from "src/app/Models/admin.model";
import { Subscriber } from "src/app/Models/subscriber.model";
import { Dataservice } from "src/app/services/data.service";
import { SubscriberService } from "src/app/services/subscriber.service";
import Swal from "sweetalert2";



@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.css"],
})
export class EditUserComponent {
  userForm: FormGroup;
  submitted = false;
  subscriberObject: any;
  dialogRef: any;
  adminUser: Admin[] = [];
  userRole: any = ''


  ngOnInit() {
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

  constructor(
    private formBuilder: FormBuilder,
    private api: SubscriberService,
    private apiData: Dataservice,
    private router: Router,
  ) {
    const currentDate = new Date();
    var SubscriberDetails: any = this.apiData.getUser();
    const subscriberObject = JSON.parse(SubscriberDetails);

    this.userForm = this.formBuilder.group({
      userprofileid: [subscriberObject?.userprofileid ?? ''],
      created_at: [subscriberObject?.created_at ?? ''],
      Fullname: [subscriberObject?.fullname || '', Validators.required],
      Email: [subscriberObject?.email || '', [Validators.required, Validators.email]],
      UserRole: [subscriberObject?.userrole || '', Validators.required],
      UserSubscriptionStatus: [subscriberObject?.subscription ?? false, Validators.required],
    });

    this.userRole = subscriberObject?.userrole || '';
  }

    onCancel() {
    this.submitted = false;
    this.userForm.reset();
    Swal.close();
    this.apiData.removeUser();
    this.router.navigate(['/admin/adminUser']);
  }
 


  onSubmit() {
    this.submitted = true;

    var body = {
      userprofileid: this.userForm.controls["userprofileid"].value,
      Fullname: this.userForm.controls["Fullname"].value,
      Email: this.userForm.controls["Email"].value,
      UserRole: this.userForm.controls["UserRole"].value,
      created_at: this.userForm.controls["created_at"].value,
      // UserSubscriptionStatus: this.userForm.controls["UserSubscriptionStatus"].value,
    };
    console.log("BODY:", body);
    if (this.userForm.invalid) {
      return;
    } else {
      this.api.InsertUpdateUserProfile(body).subscribe((data: any) => {
        console.log("SAVED:", data);
        this.showSuccessAlert();
        this.apiData.removeUser();
        
      }, 
      (err) => console.log("error", err)
      );
    }
   
    setTimeout(() => {

      if(this.userRole == 'Admin') {
        this.router.navigate(['/admin/adminUser']);
      } else {
        this.router.navigate(['/admin/subscriberUser']);
      }
    }, 2000);

    this.apiData.removeUser();

  }

  showSuccessAlert() {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: `You have successfully updated the ${this.userRole}.`,
      showConfirmButton: false,
      timer: 2000,
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
