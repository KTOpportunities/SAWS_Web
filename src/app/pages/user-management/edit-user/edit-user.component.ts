import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Admin } from "src/app/Models/admin.model";
import { AuthService } from "src/app/services/auth.service";
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
  userRole: any = '';
  userEmail: any = '';

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
    private authApi: AuthService,
    private api: SubscriberService,
    private apiData: Dataservice,
    private router: Router,
  ) {
    const currentDate = new Date();
    var SubscriberDetails: any = this.apiData.getUser();
    const subscriberObject = JSON.parse(SubscriberDetails);

    this.userForm = this.formBuilder.group({
      userprofileid: [subscriberObject?.userprofileid ?? ''],
      aspuid: [subscriberObject?.aspuid ?? ''],
      deleted_at: [subscriberObject?.deleted_at ?? ''],
      updated_at: [subscriberObject?.updated_at ?? ''],
      isdeleted: [subscriberObject?.isdeleted ?? false],
      created_at: [subscriberObject?.created_at ?? ''],
      Fullname: [subscriberObject?.fullname || '', Validators.required],
      Email: [subscriberObject?.email || '', [Validators.required, Validators.email]],
      UserRole: [subscriberObject?.userrole || '', Validators.required],
      UserSubscriptionStatus: [subscriberObject?.subscription ?? false, Validators.required],
    });

    this.userRole = subscriberObject?.userrole || '';
    this.userEmail = subscriberObject?.email || '';
  }

    onCancel() {
    this.submitted = false;
    this.userForm.reset();
    Swal.close();
    this.apiData.removeUser();
    // this.router.navigate(['/admin/adminUser']);

    var currentUrl: any = this.apiData.getUserUrl();
    const currentUrlObj = JSON.parse(currentUrl);
    this.router.navigate([currentUrlObj]);
    this.apiData.removeUserUrl();
  }
 
  onSubmit() {
    this.submitted = true;
    
    if (!this.userForm.valid) {
      this.userForm.markAllAsTouched();
      return;
    }
  
    const formValues = this.userForm.value;
    const body = {
      userprofileid: formValues.userprofileid,
      aspuid: formValues.aspuid,
      Fullname: formValues.Fullname,
      Email: formValues.Email,
      UserRole: formValues.UserRole,
      created_at: formValues.created_at,
      UserSubscriptionStatus: formValues.UserSubscriptionStatus,
    };
  
    if (this.userEmail === body.Email) {
      this.updateUserForm(body);
    } else {
      this.api.loginEmailExist(body.Email).subscribe(
        (data) => {
          if (!data) {
            this.updateUserForm(body);
          } else {
            this.showExistingEmailAlert();
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  

  updateUserForm(body: any) {
    this.api.InsertUpdateUserProfile(body).subscribe(
      (data: any) => {
       
        var user: any = this.apiData.getCurrentUser();

        if (user) {
          const userLoginDetails =  JSON.parse(user);
          if(userLoginDetails?.userID == data.aspuid) {
            this.getLoggedInUser(data.aspuid);
          } 
        }

        this.showSuccessAlert();
        this.apiData.removeUser();
        if (this.userRole == 'Admin') {
          this.router.navigate(['/admin/adminUser']);
        } else {
          this.router.navigate(['/admin/subscriberUser']);
        }
      },
      (err) => {
        console.log("Error:", err);
        this.showUnsuccessfulAlert();
      }
    );
  }

  toggleSubscriptionStatus() {
    const currentValue = this.userForm.controls["UserSubscriptionStatus"].value;
    this.userForm.controls["UserSubscriptionStatus"].setValue(!currentValue);
  }

  getLoggedInUser(Id: string){
    this.authApi.getLoggedInUser(Id).subscribe(
      (data: any) => {
       this.apiData.saveCurrentUser(data);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  showSuccessAlert() {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: `You have successfully updated the ${this.userRole}.`,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  showExistingEmailAlert() {
    Swal.fire({
      icon: "warning",
      // title: "Email exist!",
      text: "Cannot update to an existing email!",
      showConfirmButton: false,
      timer: 2500,
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
