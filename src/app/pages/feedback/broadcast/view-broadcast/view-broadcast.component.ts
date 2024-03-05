import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FeedbackMessage } from 'src/app/Models/FeedbackMessage';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { Dataservice } from 'src/app/services/data.service';
import { SubscriberService } from 'src/app/services/subscriber.service';
import Swal from 'sweetalert2';
  
@Component({
    selector: 'app-view-broadcast',
    templateUrl: './view-broadcast.component.html',
    styleUrls: ['./view-broadcast.component.css']
})
export class ViewBroadcastComponent implements OnInit{
    feedbackData: any;
    feedbackForm: FormGroup;
    userEmail: any;
    userId: any;
  
@ViewChild('content') content!: ElementRef;
  
  constructor (
      private formBuilder: FormBuilder,
      private apiAdmin: AdminService,
      private authApi: AuthService,
      private api: SubscriberService,
      public apiData: Dataservice,
      private router: Router,
      private spinner: NgxSpinnerService,
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
        responseMessage: ['', Validators.required],
        FeedbackMessages: [[]]
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
  
    scrollToBottom = () => {
      try {
        this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
      } catch (err) {}
    }
  
    isResponseMessageValid(): boolean {
      const responseMessage = this.feedbackForm.get('responseMessage')?.value;
      return responseMessage && responseMessage.trim() !== '';
    }
  
    onCancel() {
      this.router.navigate(['/admin/feedback/broadcast/listBroadcasts']);
    }
  
    showUnsuccessfulAlert() {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong. Please try again.",
      });
    }
  
  }
