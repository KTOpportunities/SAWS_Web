import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Dataservice } from 'src/app/services/data.service';
import { SubscriberService } from 'src/app/services/subscriber.service';

@Component({
  selector: 'app-attachment-file',
  templateUrl: './attachment-file.component.html',
  styleUrls: ['./attachment-file.component.css']
})
export class AttachmentFileComponent implements OnInit {

  fileBaseUrl: any;
  date: Date;

  constructor (
    private formBuilder: FormBuilder,
    private authApi: AuthService,
    private api: SubscriberService,
    private apiData: Dataservice,
    private router: Router,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AttachmentFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        const currentDate = new Date();
        
        this.fileBaseUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          data.imageSRC
        );

        this.date = currentDate;
      }
      
      ngOnInit() {
  
      }

      closeImageDialog() {
        this.dialogRef.close('close');
      }

      closeSubmitDialog() {       
        this.dialogRef.close('submit');
      }
}
