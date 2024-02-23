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

  advertForm: FormGroup;
  submitted = false;
  userEmail: any;
  currentUrl: any;
  passwordVisibility: boolean = false;
  isPasswordNotEmpty: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private api: SubscriberService,
    private apiData: Dataservice,
    private router: Router,

  ) {

    var user: any = this.apiData.getCurrentUser();

    if (user) {
      const userLoginDetails =  JSON.parse(user);
      this.userEmail = userLoginDetails.userEmail;
    }

    console.log("user email", this.userEmail)

    this.advertForm = this.formBuilder.group({
      advertId: [0],
      advert_caption: ["", Validators.required],
      advert_url: ["", this.urlValidator, Validators.required],
      uploaded_by: [this.userEmail],
      isdeleted: [false],
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.submitted = true;
    var body = {
      advertId: this.advertForm.controls["advertId"].value,
      advert_caption: this.advertForm.controls["advert_caption"].value,
      uploaded_by: this.advertForm.controls["uploaded_by"].value,
      isdeleted: this.advertForm.controls["isdeleted"].value
    };
    
    if (this.advertForm.invalid) {
      return;
    } else {

      console.log("body", body)
      
      // this.saveUserForm(body);

      // this.api.loginEmailExist(body.Email).subscribe(
      //   (data) => {

      //     if(!data) {

      //     } else {
      //       this.showExistingEmailAlert()
      //     }
      //   },
      //   (error) => {
      //     console.error(error);
      //   }
      // );    

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

  urlValidator(control: AbstractControl) {
    const value = control.value;
    const urlPattern = /^((http|https|ftp):\/\/)?([a-zA-Z0-9-_.]+\.[a-zA-Z]{2,})(:[0-9]+)?(\/[a-zA-Z0-9-_.#?&=:]+)*\/?$/;
    const isValid = urlPattern.test(value);

    return isValid ? null : { invalidUrl: true };
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
    this.advertForm.reset();
  }
}
