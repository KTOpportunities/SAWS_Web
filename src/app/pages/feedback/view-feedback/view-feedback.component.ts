import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { Dataservice } from 'src/app/services/data.service';
import { SubscriberService } from 'src/app/services/subscriber.service';
import Swal from 'sweetalert2';
import { AttachmentFileComponent } from '../attachment-file/attachment-file.component';
import { fileDataFeedback } from 'src/app/Models/File';

@Component({
  selector: 'app-view-feedback',
  templateUrl: './view-feedback.component.html',
  styleUrls: ['./view-feedback.component.css']
})
export class ViewFeedbackComponent implements OnInit{
  feedbackData: any;
  feedbackForm: FormGroup;
  userEmail: any;
  userId: any;

  addFile: boolean = false;

  selectedFile: File | undefined;
  selectedFileName: string | undefined;
  selectedFileSrc: string | ArrayBuffer | null = null;

  @ViewChild('myFileInput') myFileInputVariable!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  fileFeedback: any = {};

  files: fileDataFeedback[] = [];

  constructor (
    private formBuilder: FormBuilder,
    private apiAdmin: AdminService,
    private authApi: AuthService,
    private api: SubscriberService,
    public apiData: Dataservice,
    private router: Router,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
  )  {
    
    this.feedbackForm = this.formBuilder.group({
      feedbackId: [],
      title: [],
      fullname: [],
      senderId: [],
      senderEmail: [],
      responderId: [],
      responderEmail: [],
      created_at: [],
      updated_at: [],
      isdeleted: [],
      deleted_at: [],
      isresponded: [],
      feedbackFile: [''],
      responseMessage: ['', Validators.required],
      FeedbackMessages: [[]],
    });
    
  }

  ngOnInit() {
    this.apiData.getFeedbackData().subscribe(data => {
      this.feedbackData = data;
      this.feedbackForm.patchValue(data);
    });

    var user: any = this.apiData.getCurrentUser();

    if (user) {
      const userLoginDetails =  JSON.parse(user);
      this.userEmail = userLoginDetails.userEmail;
      this.userId = userLoginDetails.userID;
    }

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  onSubmit() {   
    if (this.isResponseMessageValid() && this.feedbackForm.valid) {
  
      const formValues = this.feedbackForm.value;
  
      const body = {
        feedbackId: formValues.feedbackId,
        fullname: formValues.fullname,
        senderId: formValues.senderId,
        senderEmail: formValues.senderEmail,
        responderId: this.userId,
        responderEmail: this.userEmail,
        created_at: formValues.created_at,
        title: formValues.title,
        isresponded: true,
        FeedbackMessages: [
          {
            senderId: formValues.senderId,
            senderEmail: formValues.senderEmail,
            responderId: this.userId,
            responderEmail: this.userEmail,
            feedback: '',
            response: formValues.responseMessage,
          },
        ]
      };
  
      this.updateFeedbackForm(body);

    } else {
      return;
    }

  }

  onSubmitAttachment() {   
    if ( this.selectedFile ) {
  
      const formValues = this.feedbackForm.value;
  
      const body = {
        feedbackId: formValues.feedbackId,
        fullname: formValues.fullname,
        senderId: formValues.senderId,
        senderEmail: formValues.senderEmail,
        responderId: this.userId,
        responderEmail: this.userEmail,
        created_at: formValues.created_at,
        title: formValues.title,
        isresponded: true,
        FeedbackMessages: [
          {
            senderId: formValues.senderId,
            senderEmail: formValues.senderEmail,
            responderId: this.userId,
            responderEmail: this.userEmail,
            feedback: '',
            response: '',
            feedbackAttachment: '',
            feedbackAttachmentFileName: '',
            responseAttachment: formValues.responseMessage,
            responseAttachmentFileName: this.selectedFileName,
          },
        ]
      };
      this.updateFeedbackFormWithAttachment(body);
    } else {
      return;
    }

  }

  onUpload(id: number) {
    if (this.files.length > 0) {

      this.files[0].Id = 0;
      this.files[0].feedbackMessageId = id;

      const formData = new FormData();

      for (let i = 0; i < this.files.length; i++) {
        formData.append(`files[${i}].id`, JSON.stringify(this.files[i].Id));
        formData.append(
          `files[${i}].feedbackMessageId`,
          JSON.stringify(this.files[i].feedbackMessageId)
        );
        formData.append(`files[${i}].DocTypeName`, this.files[i].DocTypeName);
        formData.append(`files[${i}].file`, this.files[i].file);
      }

      this.api.PostDocsForFeedback(formData).subscribe(
        (event: any) => {
          this.resetFilesInp();

          this.getFeedback(this.feedbackData.feedbackId);
        },
        (err) => {
          console.log('file upload failed: ', err);
        }
      );
    }
  }

  // onChangeAdvert(event: any) {
  //   let fileSize = event.target.files[0]
  //   if(fileSize.size <= 26214400 ) {
  //     this.updateFileData(
  //       this.fileFeedback,
  //       event.target.files[0],
  //       "Feedback"
  //      );
  //   } else {
  //     this.alertFileMessage("Feedback",`${fileSize.type}`)
  //     this.myFileInputVariable.nativeElement.value = '';
  //   }
  // }

  updateFileData(
    fileDataToUpdate: fileDataFeedback,
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

  updateFeedbackForm(body: any) {

    this.api.postInsertNewFeedback(body).subscribe(
      (data: any) => {
        this.feedbackForm.reset();
        this.getFeedback(this.feedbackData.feedbackId)
      },
      (err) => {
        console.log("Error:", err);
        this.showUnsuccessfulAlert();
      }
    );
  }

  updateFeedbackFormWithAttachment(body: any) {

    this.api.postInsertNewFeedback(body).subscribe(
      (data: any) => {
        this.feedbackForm.reset();
        console.log("data", data.DetailDescription.FeedbackMessages[0])
        this.onUpload(data.DetailDescription.FeedbackMessages[0].feedbackMessageId);
      },
      (err) => {
        console.log("Error:", err);
        this.showUnsuccessfulAlert();
      }
    );
  }

  getFeedback(feedbackId: number) {
    this.apiAdmin.getFeedbackById(feedbackId).subscribe(
      (data) => {
        this.apiData.setFeedbackData(data);
      },
      (error) => {
        console.error("Error in fetching data:", error);
        this.spinner.hide();
      }

    );
  }

  openAttachmentDialog(element: any, enterAnimationDuration: string, exitAnimationDuration: string) {

    const formValues = this.feedbackForm.value;

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(AttachmentFileComponent, {
      data: {
        feedbackData: element,
        imageSRC: this.selectedFileSrc || element.file_url,
        message: formValues.responseMessage || '',
        responderEmail: this.userEmail,
        resonderId: this.userId,
        addFile: this.addFile
      },
      enterAnimationDuration,
      exitAnimationDuration,
      width:'65%',
      // height:'80%',
    });

    
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result == 'submit'){
        this.onSubmitAttachment();
      }
      
      this.selectedFile = undefined;
      this.selectedFileSrc = null;
      this.addFile = false;
      // this.feedbackForm.reset();
    });  
  }

  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) {}
  }

  isResponseMessageValid(): boolean {
    const responseMessage = this.feedbackForm.get('responseMessage')?.value;
    return responseMessage && responseMessage.trim() !== '';
  }

  onFileSelected(event: any) {

    const file = event.target.files[0];
    this.selectedFile = file;
    this.selectedFileName = file.name;

    if ( file.size <= 26214400 ) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileSrc = reader.result;
        this.addFile = true;
        this.openAttachmentDialog(this.feedbackData, '500ms', '500ms');
      };

      reader.onerror = (error) => {
        console.error("File reading error:", error);
      };
      reader.readAsDataURL(file);

      this.updateFileData(
          this.fileFeedback,
          event.target.files[0],
          "Feedback"
         );
    }
      else {
        this.alertFileMessage("Feedback",`${file.type}`)
        this.resetFilesInp();
    }

    event.target.value = null;
  }

  onCancel() {
    this.router.navigate(['/admin/feedback']);
  }

  showUnsuccessfulAlert() {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Something went wrong. Please try again.",
    });
  }

  resetFilesInp() {
    this.myFileInputVariable.nativeElement.value = '';
  }

  alertFileMessage(message: string, text: string) {
    Swal.fire({
      icon: "warning",
      title: message,
      text: text.toUpperCase() + " file exceeds 25Mb, please upload a smaller size file",
      showConfirmButton: false,
      timer: 2000,
    });
  }

}