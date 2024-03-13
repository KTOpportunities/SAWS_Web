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
  fileType: any = '';
  userEmail: any = ''; 

  @ViewChild('myFileInput') myFileInputVariable!: ElementRef;

  fileAdvert: any = {};

  files: fileData[] = [];
  file: AdvertDocument[] = [];
  fileId: any;
  advertId: any;
  createdAt: any = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private authApi: AuthService,
    private api: SubscriberService,
    private apiData: Dataservice,
    private router: Router,
    public dialog: MatDialog,
  ) {
    const currentDate = new Date();

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
      DocAdverts: [[], Validators.required],
      advertFile: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.apiData.getFeedbackData().subscribe(data => {
      this.advertForm.patchValue(data.Advert);
      
      this.url = data.FileUrl;
      this.fileType = this.apiData.getFileType(data.Advert.DocAdverts[0].file_mimetype)
      // this.files = data.Advert.DocAdverts[0];

      this.fileId = data.Advert.DocAdverts[0].Id;
      this.advertId = data.Advert.advertId;
      this.createdAt = data.Advert.DocAdverts[0].created_at;
    });
  }

  onCancel() {
    this.submitted = false;
    Swal.close();
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
       
        // this.onUpload();

        this.onUpload(data.DetailDescription.advertId);
        
        this.router.navigate(['/admin/advertisement']);

        this.showSuccessAlert();
      },
      (err) => {
        console.log("Error:", err);
        this.showUnsuccessfulAlert();
      }
    );
  }

  onUpload(id: number) {

    if (this.files.length > 0) {

      this.files[0].Id = this.fileId;
      this.files[0].advertId = id;
      this.files[0].created_at = this.createdAt;

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

 

  openViewImageDialog(element: any,  enterAnimationDuration: string, exitAnimationDuration: string) {

    // console.log('element source edit - before', element);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    // dialogConfig.data = this.url;
    // dialogConfig.width = '65%';
    // dialogConfig.height = 'auto';
    // dialogConfig.maxWidth = '100%';

    const dialogRef = this.dialog.open(ViewAdvertImageComponent, {
      data: {
        url: this.url,
        fileType: this.fileType
      },
      enterAnimationDuration,
      exitAnimationDuration,
      width:'auto',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
    });  
  }

  onChangeAdvert(event: any) {
    let file = event.target.files[0]

    if(file.size <= 26214400) {
      this.updateFileData(
        this.fileAdvert,
        event.target.files[0],
        "Advert"
       );
    } else {
      this.alertFileMessage("Advert",`${file.type}`)
      this.myFileInputVariable.nativeElement.value = '';
    }

  }

  updateFileData(
    fileDataToUpdate: fileData,
    newFile: File,
    docTypeName: string
  ) {

    console.log("fileDataToUpdate", fileDataToUpdate)
    console.log("newFile", newFile)
    console.log("docTypeName", docTypeName)
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
      text: text.toUpperCase() + " image / gif exceeds 25Mb, please upload a smaller size image / gif",
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