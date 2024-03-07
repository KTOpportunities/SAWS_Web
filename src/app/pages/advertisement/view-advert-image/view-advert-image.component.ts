import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AdvertDocument } from "src/app/Models/AdvertDocument";
import { Admin } from "src/app/Models/admin.model";
import { AuthService } from "src/app/services/auth.service";
import { Dataservice } from "src/app/services/data.service";
import { SubscriberService } from "src/app/services/subscriber.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from "sweetalert2";

@Component({
  selector: 'app-view-advert-image',
  templateUrl: './view-advert-image.component.html',
  styleUrls: ['./view-advert-image.component.css']
})
export class ViewAdvertImageComponent implements OnInit {

  imageBaseUrl: any;

  
  constructor (
    private formBuilder: FormBuilder,
    private authApi: AuthService,
    private api: SubscriberService,
    private apiData: Dataservice,
    private router: Router,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ViewAdvertImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    )  {
      const currentDate = new Date();
      
      console.log('Received data - view image:', data);

      this.imageBaseUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'data:image/jpg;base64,' + data.data.base64_file_url
      );

      console.log("this.imageBaseUrl", this.imageBaseUrl )
    }
    
    ngOnInit() {


    }

    closeImageDialog() {
      this.dialogRef.close('');
    }

}
