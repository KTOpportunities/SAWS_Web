import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscriber } from "src/app/models/subscriber.model";
import { SubscriberService } from "src/app/services/subscriber.service";
import Swal from "sweetalert2";



@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.css"],
})
export class EditUserComponent {
  SubscriberDetails: Subscriber = {
    Fullname: "Alf Test",
    Username: "alf@kto.co.za",
    Email: "alf@kto.co.za",
    Password: "123456pP",
    UserRole: "Subscriber",
    userprofileid: 0,
    created_at: "2024-01-19T13:59:34.4097751",
    updated_at: "2024-01-19T13:59:34.4097751",
    deleted: false,
    deleted_at: "any",
  };
  userForm: FormGroup;
  submitted = false;
  subscriberObject: any;
  dialogRef: any;
  ngOnInit() {
    // TEST TEST TSET:::: {"userprofileid":8,"fullname":"Alf Test","email":"nvtahulela@gmail.com","mobilenumber":null,"userrole":"Subscriber","aspuid":"30ce7a9a-9f22-4367-90b7-70980f088456","created_at":"2024-01-19T13:59:34.4098243","updated_at":"2024-01-19T13:59:34.4097751","isdeleted":false,"deleted_at":null}
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
    private router: Router,
  ) {
    const currentDate = new Date();
    var SubscriberDetails: any = sessionStorage.getItem("SubscriberDetails");
    console.log("TEST TEST TSET::::", SubscriberDetails);

    const subscriberObject = JSON.parse(SubscriberDetails);
    console.log("NAME:", subscriberObject.fullname);
    this.userForm = this.formBuilder.group({
      userprofileid: [subscriberObject.userprofileid],
      created_at: [subscriberObject.created_at],
      Fullname: [subscriberObject.fullname, Validators.required],
      Email: [subscriberObject.email, [Validators.required, Validators.email]],
      UserRole: [subscriberObject.userrole, Validators.required],
    });
  }

  onCancel() {
    this.submitted = false;
    this.userForm.reset();
    Swal.close();
    this.router.navigate(['/admin']);
  }
 


  onSubmit() {
    this.submitted = true;
    this.router.navigate(['/admin']);

    // TEST TEST TSET:::: {"userprofileid":8,"fullname":"Alf Test","email":"nvtahulela@gmail.com","mobilenumber":null,"userrole":"Subscriber","aspuid":"30ce7a9a-9f22-4367-90b7-70980f088456","created_at":"2024-01-19T13:59:34.4098243","updated_at":"2024-01-19T13:59:34.4097751","isdeleted":false,"deleted_at":null}

    debugger;
    // var body = {
    //   Fullname: this.userForm.controls["Fullname"].value,

    //   Email: this.userForm.controls["Email"].value,
    //   Password: this.userForm.controls["Password"].value,
    //   UserRole: this.userForm.controls["UserRole"].value,
    // };
    var body = {
      userprofileid: this.userForm.controls["userprofileid"].value,
      Fullname: this.userForm.controls["Fullname"].value,
      Email: this.userForm.controls["Email"].value,
      UserRole: this.userForm.controls["UserRole"].value,
      created_at: this.userForm.controls["created_at"].value,
    };
    debugger;
    console.log("BODY:", body);
    if (this.userForm.invalid) {
      debugger;
      return;
    } else {
      this.api.InsertUpdateUserProfile(body).subscribe((data: any) => {
        debugger;
        console.log("SAVED:", data);
        // this.nextStep();

        debugger;
        this.showSuccessAlert();
        
      });
    }
  }
  showSuccessAlert() {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "You have successfully updated the Admin/Subscriber.",
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
