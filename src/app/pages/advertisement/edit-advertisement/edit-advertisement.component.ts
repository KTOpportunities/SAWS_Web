import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { 
  AbstractControl, 
  FormBuilder, 
  FormGroup, 
  ValidationErrors, 
  Validators
 } from "@angular/forms";
 import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { AdvertDocument } from "src/app/Models/AdvertDocument";
import { fileData } from "src/app/Models/File";
import { Admin } from "src/app/Models/admin.model";
import { AuthService } from "src/app/services/auth.service";
import { Dataservice } from "src/app/services/data.service";
import { SubscriberService } from "src/app/services/subscriber.service";
import Swal from "sweetalert2";
import { ViewAdvertImageComponent } from "../view-advert-image/view-advert-image.component";

@Component({
  selector: 'app-edit-advertisement',
  templateUrl: './edit-advertisement.component.html',
  styleUrls: ['./edit-advertisement.component.css']
})
export class EditAdvertisementComponent implements OnInit {
  advertForm: FormGroup;
  submitted = false;
  subscriberObject: any;
  dialogRef: any;
  adminUser: Admin[] = [];
  userRole: any = '';
  url: any = '';
  userEmail: any = ''; 

  @ViewChild('myFileInput') myFileInputVariable!: ElementRef;

  fileAdvert: any = {};

  files: fileData[] = [];
  file: AdvertDocument[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authApi: AuthService,
    private api: SubscriberService,
    private apiData: Dataservice,
    private router: Router,
    public dialog: MatDialog,
  ) {
    const currentDate = new Date();
    var SubscriberDetails: any = this.apiData.getAdvert();
    const subscriberObject = JSON.parse(SubscriberDetails);

    this.advertForm = this.formBuilder.group({
      advertId: [],
      advert_caption: ['', Validators.required],
      deleted_at: [],
      updated_at: [],
      isdeleted: [],
      ispublished: [],
      created_at: [],
      uploaded_by: [],
      advert_url: ['', Validators.required],
      DocAdverts: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.apiData.getFeedbackData().subscribe(data => {
      this.url = data.FileUrl;
      this.advertForm.patchValue(data.Advert);
    });
  }

  onCancel() {
    this.submitted = false;
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
      advertId: formValues.advertId,
      advert_caption: formValues.advert_caption,
      advert_url: formValues.advert_url,
      uploaded_by: formValues.uploaded_by,
      isdeleted: formValues.isdeleted,
      ispublished: formValues.ispublished,
      created_at: formValues.created_at,
    };

    this.updateAdvertForm(body);
  
  }  

  updateAdvertForm(body: any) {

    this.api.postInsertNewAdvert(body).subscribe(
      (data: any) => {
       
        this.showSuccessAlert();

        this.onUpload();
        
        this.apiData.removeAdvert();
          this.router.navigate(['/admin/advertisement']);
      },
      (err) => {
        console.log("Error:", err);
        this.showUnsuccessfulAlert();
      }
    );
  }

  onUpload() {
    if (this.files.length > 0) {

      this.files[0].Id = this.file[0].Id;
      this.files[0].advertId = this.file[0].advertId;
      this.files[0].created_at = this.file[0].created_at;

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

  openViewImageDialog(element: any,  enterAnimationDuration: string, exitAnimationDuration: string) {

    // console.log('element source edit - before', element);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = this.url;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = '65%';
    // dialogConfig.height = 'auto';
    // dialogConfig.maxWidth = '100%';
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(ViewAdvertImageComponent, {
      data: dialogConfig,
      enterAnimationDuration,
      exitAnimationDuration,
      width:'auto',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
    });  
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

  resetFilesInp() {
    this.myFileInputVariable.nativeElement.value = '';
  }

  showSuccessAlert() {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: `You have successfully updated the advert.`,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  alertFileMessage(message: string, text: string) {
    Swal.fire({
      // position: "top-end",
      icon: "warning",
      title: message,
      text: text.toUpperCase() + " image / gif exceeds 10mb, please upload a smaller size image / gif",
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

}