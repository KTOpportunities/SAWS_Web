import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Feedback } from 'src/app/Models/Feedback';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { Dataservice } from 'src/app/services/data.service';
import { SubscriberService } from 'src/app/services/subscriber.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-broadcast',
  templateUrl: './add-broadcast.component.html',
  styleUrls: ['./add-broadcast.component.css']
})
export class AddBroadcastComponent implements OnInit{

  feedbackData: any;
  broadcastData: any[] = [];
  broadcastForm: FormGroup;
  submitted = false;

  userEmail: any;
  userId: any;

  @ViewChild('content') content!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private apiAdmin: AdminService,
    private authApi: AuthService,
    private api: SubscriberService,
    public apiData: Dataservice,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {

    this.broadcastForm = this.formBuilder.group({
      feedbackId: [],
      subject: ['Broadcast'],
      title: ['', Validators.required],
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
      broadcastMessage: ['', Validators.required],
      FeedbackMessages: [[]]
    });

  }

  ngOnInit(): void {
    this.apiData.getFeedbackData().subscribe(data => {
      this.feedbackData = data;
    });

    var user: any = this.apiData.getCurrentUser();

    if (user) {
      const userLoginDetails =  JSON.parse(user);
      this.userEmail = userLoginDetails.userEmail;
      this.userId = userLoginDetails.userID;
    }

  }

  onSubmit() {

    this.submitted = true;

    if (this.broadcastForm.valid) {
      
      this.feedbackData.forEach((element: { [key: string]: any; }) => {

        element['title'] = this.broadcastForm.value.title;
        this.broadcastForm.patchValue(element);
        const formValues = this.broadcastForm.value;

        const body = {
          feedbackId: 0,
          fullname: formValues.fullname,
          senderId: formValues.senderId,
          senderEmail: formValues.senderEmail,
          responderId: '',
          responderEmail: '',
          created_at: formValues.created_at,
          title: formValues.title,
          isresponded: true,
          broadcasterId: this.userId,
          broadcasterEmail: this.userEmail,
          FeedbackMessages: [
            {
              senderId: formValues.senderId,
              senderEmail: formValues.senderEmail,
              responderId: '',
              responderEmail: '',
              feedback: '',
              response: '',
              broadcast: formValues.broadcastMessage,
            },
          ]
        };

        this.broadcastData.push(body);
      });

      this.addBroadcastMessageForm(this.broadcastData);

    } else {
      return;
    }

  }

  addBroadcastMessageForm(broadcastData: any[]) {

    this.api.postInsertBroadcastMessages(broadcastData).subscribe(
      (data: any) => {
        this.broadcastForm.reset();

        this.showSuccessAlert();
        this.router.navigate(['/admin/feedback/broadcast/listBroadcasts']);

      },
      (err) => {
        console.log("Error:", err);
        this.showUnsuccessfulAlert();
      }
    );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) {}
  }

  isBroadcastMessageValid(): boolean {
    const broadcastMessage = this.broadcastForm.get('broadcastMessage')?.value;
    return broadcastMessage && broadcastMessage.trim() !== '';
  }

  showUnsuccessfulAlert() {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Something went wrong. Please try again.",
    });
  }

  showSuccessAlert() {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Broadcast message successfully submitted!',
      showConfirmButton: false,
      timer: 2500,
    });
  }

  onCancel() {
    this.router.navigate(['/admin/feedback/broadcast']);
  }

}
