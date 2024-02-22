import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Admin } from "src/app/Models/admin.model";
import { AuthService } from "src/app/services/auth.service";
import { Dataservice } from "src/app/services/data.service";
import { SubscriberService } from "src/app/services/subscriber.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-edit-advertisement',
  templateUrl: './edit-advertisement.component.html',
  styleUrls: ['./edit-advertisement.component.css']
})
export class EditAdvertisementComponent {
  advertForm: FormGroup;
  submitted = false;
  subscriberObject: any;
  dialogRef: any;
  adminUser: Admin[] = [];
  userRole: any = '';
  userEmail: any = '';

  ngOnInit() {
  }

  constructor(
    private formBuilder: FormBuilder,
    private authApi: AuthService,
    private api: SubscriberService,
    private apiData: Dataservice,
    private router: Router,
  ) {
    const currentDate = new Date();
    var SubscriberDetails: any = this.apiData.getAdvert();
    const subscriberObject = JSON.parse(SubscriberDetails);

    this.advertForm = this.formBuilder.group({
      advertId: [],
      advert_caption: [],
      deleted_at: [],
      updated_at: [],
      isdeleted: [],
      created_at: [],
      uploaded_by: [],
      advert_url: [],
      DocAdverts: [[]]
    });

    if (subscriberObject) {
      this.advertForm.patchValue(subscriberObject);
    }

    this.userRole = subscriberObject?.userrole || '';
    this.userEmail = subscriberObject?.email || '';
  }

    onCancel() {
    this.submitted = false;
    // this.userForm.reset();
    Swal.close();
    this.apiData.removeAdvert();
    this.router.navigate(['/admin/advertisement']);
  }

  convertBytesToMegabytes(bytes: number): number {
      return bytes / (1024 * 1024);
  }
  
  onSubmit() {
    this.submitted = true;
    
    if (!this.advertForm.valid) {
      this.advertForm.markAllAsTouched();
      return;
    }
  
    const formValues = this.advertForm.value;
    const body = {
      userprofileid: formValues.userprofileid,
      aspuid: formValues.aspuid,
      Fullname: formValues.Fullname,
      Email: formValues.Email,
      UserRole: formValues.UserRole,
      created_at: formValues.created_at,
      UserSubscriptionStatus: formValues.UserSubscriptionStatus,
    };
  
  }  

  updateUserForm(body: any) {
    this.api.InsertUpdateUserProfile(body).subscribe(
      (data: any) => {
       
        var user: any = this.apiData.getCurrentUser();

        if (user) {
          const userLoginDetails =  JSON.parse(user);
        }

        this.showSuccessAlert();
        this.apiData.removeAdvert();
          this.router.navigate(['/admin/advertisement']);
      },
      (err) => {
        console.log("Error:", err);
        this.showUnsuccessfulAlert();
      }
    );
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

  showUnsuccessfulAlert() {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Something went wrong. Please try again.",
    });
  }

}
