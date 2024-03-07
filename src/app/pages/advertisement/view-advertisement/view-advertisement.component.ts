import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AdvertDocument } from "src/app/Models/AdvertDocument";
import { Admin } from "src/app/Models/admin.model";
import { AuthService } from "src/app/services/auth.service";
import { Dataservice } from "src/app/services/data.service";
import { SubscriberService } from "src/app/services/subscriber.service";
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from "sweetalert2";
import { ViewAdvertImageComponent } from "../view-advert-image/view-advert-image.component";

@Component({
  selector: 'app-view-advertisement',
  templateUrl: './view-advertisement.component.html',
  styleUrls: ['./view-advertisement.component.css']
})
export class ViewAdvertisementComponent {
  advertForm: FormGroup;
  submitted = false;
  subscriberObject: any;
  dialogRef: any;
  adminUser: Admin[] = [];
  userRole: any = '';
  userEmail: any = '';
  files: AdvertDocument[] = [];

  ngOnInit() {
  }

  constructor (
    private formBuilder: FormBuilder,
    private authApi: AuthService,
    private api: SubscriberService,
    private apiData: Dataservice,
    private router: Router,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
  ) {
    const currentDate = new Date();
    var advertDetails: any = this.apiData.getAdvert();
    const advertObject = JSON.parse(advertDetails);

    this.advertForm = this.formBuilder.group({
      advertId: [],
      advert_caption: [],
      deleted_at: [],
      updated_at: [],
      isdeleted: [],
      created_at: [],
      uploaded_by: [],
      advert_url: [],
      DocAdverts: [[]]
    });

    if (advertObject) {
      this.advertForm.patchValue(advertObject);
    }
  }


  openViewImageDialog(element: any) {

    console.log('element source edit - before', element);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = element;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '65%';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '100%';
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(ViewAdvertImageComponent, {
      data: dialogConfig,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
    });  
  }

    onCancel() {
      Swal.close();
      this.apiData.removeAdvert();
      this.router.navigate(['/admin/advertisement']);
  }

  convertBytesToMegabytes(bytes: number): number {
     return bytes / (1024 * 1024);
  }
}
