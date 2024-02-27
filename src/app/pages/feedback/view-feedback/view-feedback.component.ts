import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FeedbackMessage } from 'src/app/Models/FeedbackMessage';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { Dataservice } from 'src/app/services/data.service';
import { SubscriberService } from 'src/app/services/subscriber.service';
import Swal from 'sweetalert2';

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

  @ViewChild('content') content!: ElementRef;

  constructor (
    private formBuilder: FormBuilder,
    private apiAdmin: AdminService,
    private authApi: AuthService,
    private api: SubscriberService,
    private apiData: Dataservice,
    private router: Router,
    private spinner: NgxSpinnerService,
  )  {

    var feedbackDetails: any = this.apiData.getFeedback();
    const feedbackObject = JSON.parse(feedbackDetails);
    
    this.feedbackForm = this.formBuilder.group({
      feebackId: [],
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
      responseMessage: [''],
      FeedbackMessages: [[]]
    });
    
    // if (feedbackObject) {
    //   this.feedbackForm.patchValue(feedbackObject);
    // }

    //  if (this.feedbackData) {
    //   this.feedbackForm.patchValue(this.feedbackData);
    // }

    
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
    
    this.spinner.show();

    const formValues = this.feedbackForm.value;

    const body = {
      feebackId: formValues.feebackId,
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

  }

  updateFeedbackForm(body: any) {

    this.api.postInsertNewFeedback(body).subscribe(
      (data: any) => {
        this.feedbackForm.reset();
          this.getFeedback(this.feedbackData.feebackId)
      },
      (err) => {
        console.log("Error:", err);
        this.showUnsuccessfulAlert();
        this.spinner.hide();
      }
    );
  }

  getFeedback(feedbackId: number) {
    this.apiAdmin.getFeedbackById(feedbackId).subscribe(
      (data) => {

        this.apiData.setFeedbackData(data);
        setTimeout(() => {
          this.spinner.hide();
        });
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

  onCancel() {
    Swal.close();
    this.apiData.removeFeedback();
    this.router.navigate(['/admin/feedback']);
  }

  showUnsuccessfulAlert() {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Something went wrong. Please try again.",
    });
  }

}
