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
import { fileData } from "src/app/Models/File";

@Component({
  selector: 'app-add-advertisement',
  templateUrl: './add-advertisement.component.html',
  styleUrls: ['./add-advertisement.component.css']
})
export class AddAdvertisementComponent implements OnInit {

  advertForm: FormGroup;
  // advertDocForm: FormGroup;
  submitted = false;
  userEmail: any;
  currentUrl: any;
  passwordVisibility: boolean = false;
  isPasswordNotEmpty: boolean = false;

  @ViewChild('myFileInput') myFileInputVariable!: ElementRef;

  fileAdvert: any = {};

  files: fileData[] = [];


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

    this.advertForm = this.formBuilder.group({
      advertId: [0],
      advert_caption: ["", Validators.required],
      advert_url: ["", this.urlValidator, Validators.required],
      uploaded_by: [this.userEmail],
      isdeleted: [false],
      ispublished: [false],
      advertFile: ["", Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.submitted = true;

    var body = {
      advertId: this.advertForm.controls["advertId"].value,
      advert_caption: this.advertForm.controls["advert_caption"].value,
      advert_url: this.advertForm.controls["advert_url"].value,
      uploaded_by: this.advertForm.controls["uploaded_by"].value,
      isdeleted: this.advertForm.controls["isdeleted"].value,
      ispublished: this.advertForm.controls["ispublished"].value
    };
    
    if (this.advertForm.invalid) {
      return;
    } else {    
      this.saveUserForm(body);
    }
  }

  saveUserForm(body: any){
    this.api.postInsertNewAdvert(body)
      .subscribe((data: any) => {        

        this.showSuccessAlert();

        this.onUpload(data.DetailDescription.advertId);

        this.router.navigate(['/admin/advertisement']);
      }, 
      (err) => console.log("error", err)
      );
  }

  onUpload(id: number) {
    if (this.files.length > 0) {

      this.files[0].Id = 0;
      this.files[0].advertId = id;

      const formData = new FormData();

      for (let i = 0; i < this.files.length; i++) {
        formData.append(`files[${i}].id`, JSON.stringify(this.files[i].Id));
        formData.append(
          `files[${i}].advertId`,
          JSON.stringify(this.files[i].advertId)
        );
        formData.append(`files[${i}].DocTypeName`, this.files[i].DocTypeName);
        formData.append(`files[${i}].file`, this.files[i].file);
      }

      this.api.PostDocsForAdvert(formData).subscribe(
        (event: any) => {
          this.resetFilesInp();
        },
        (err) => {
          console.log('file upload failed: ', err);
        }
      );
    }
  }

  onChangeAdvert(event: any) {
      let fileSize = event.target.files[0]
      if(fileSize.size <= 10485760) {
        this.updateFileData(
          this.fileAdvert,
          event.target.files[0],
          "Advert"
         );
      } else {
        this.alertFileMessage("Advert",`${fileSize.type}`)
        this.myFileInputVariable.nativeElement.value = '';
      }
    }

    updateFileData(
      fileDataToUpdate: fileData,
      newFile: File,
      docTypeName: string
    ) {
      if (newFile) {
        fileDataToUpdate.file = newFile;
        fileDataToUpdate.DocTypeName = docTypeName;
  
        const index = this.files.findIndex(
          (file) => file.DocTypeName === docTypeName
        );
  
        if (index !== -1) {
          this.files[index] = fileDataToUpdate;
        } else {
          this.files.push(fileDataToUpdate);
        }
      }
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
      text: "You added new advert successfully.",
    });
  }

  showUnsuccessfulAlert() {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Something went wrong. Please try again.",
    });
  }

  alertFileMessage(message: string, text: string) {
      Swal.fire({
        icon: "warning",
        title: message,
        text: text.toUpperCase() + " image / gif exceeds 10mb, please upload a smaller size image / gif",
        showConfirmButton: false,
        timer: 2000,
    });
  }
  

  resetFilesInp() {
    this.myFileInputVariable.nativeElement.value = '';
  }
  
  onReset() {
    this.submitted = false;
    this.advertForm.reset();
  }
}
