import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Admin } from 'src/app/Models/admin.model';
import { AdminService } from 'src/app/services/admin.service';
import { Dataservice } from 'src/app/services/data.service';
import { SubscriberService } from 'src/app/services/subscriber.service';
import { EditUserComponent } from '../user-management/edit-user/edit-user.component';
import Swal from 'sweetalert2';
import { Advert } from 'src/app/Models/Advert';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.css']
})
export class AdvertisementComponent implements OnInit {

  displayedColumns: string[] = [
    "uploaded_by",
    "uploaded_date",
    "advert_caption",
    "advert",
    "publish",
    "action",
  ];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('picker', { static: false }) picker!: MatDatepicker<Date>;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  dataSource = new MatTableDataSource<Advert>();
  selection = new SelectionModel<Advert>(true, []);

  statuses: any[] = [
    { id: 1, published: true },
    { id: 2, published: false }
  ];

  selectedStatus: number | undefined;
  advertList: Advert[] = [];

  pageSize = 5;
  pageSizeStore = 5;
  currentPage = 0;
  currentPageStore = 0;
  
  TotalRecords: any = 0;
  filteredData: any = '';

  selectedDateString: any;
  selectedStatusName: any = '';
  date: Date;

constructor(
  private apiAdmin: AdminService,
  private apiService: SubscriberService,
  private apiData: Dataservice,
  public dialog: MatDialog,
  private router: Router,
  private route: ActivatedRoute,
  private spinner: NgxSpinnerService,
  public datePipe: DatePipe,
  ) {
    
    this.dataSource.filterPredicate = (data, filter: string) =>
      !filter || data.created_at.includes(filter);

    this.date = new Date();
  }

  ngOnInit(): void {
    this.getAllAdverts(); 
    this.filterData(); 
  }

  getAllAdverts(page: number = 1){

    var currentPage: number = Number(sessionStorage.getItem('currentPage'));
    var pageSize: number = Number(sessionStorage.getItem('pageSize'));

    if (currentPage == 0) {
      currentPage = this.currentPage;
    } else {
      this.currentPage = currentPage
    }
    
    if (pageSize == 0) {
      pageSize = this.pageSize;
    } else {
      this.pageSize = pageSize;
    }


    this.apiAdmin.GetPagedAllAdverts(this.currentPage + page, this.pageSize).subscribe({
      next: (data: any) => {
          this.spinner.hide();
          this.advertList = data.Data;

          // debugger;

          sessionStorage.removeItem('currentPage');
          sessionStorage.removeItem('pageSize');

          this.TotalRecords = data.TotalRecords;
     
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = data.TotalRecords;
          });
        
          this.dataSource = new MatTableDataSource(this.advertList);
          this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
          console.error("Error fetching data from API:", error);
      },
    });
 }

 selectStatus(status: any) {
  this.selectedStatus = status;
  this.filterStatus();
}

filterStatus() {
  this.selectedStatusName = '';
  this.selectedDateString = '';

  this.dataSource.filterPredicate = (data, filter: string) =>
    !filter || data.ispublished.toString().includes(filter);

  this.dataSource.filter = this.selectedStatus!.toString().trim();

  const selectedStatus = this.statuses.find(
    (status) => status.status === this.selectedStatus
  );

  if (selectedStatus) {
    this.selectedStatusName = selectedStatus.name;
  }
}

 filterData() {
  this.apiData.filterObservable$.subscribe((filter: string) => {
    this.dataSource.filter = filter.trim().toLowerCase();
  });
 }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getAllAdverts();

    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: any, filter: string) =>
        data.name.indexOf(filter) || data.Status.indexOf(filter) != -1;
    }
  }

  selectDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.date = event.value!;
    this.filterDate();
  }

  openPicker() {
    if (this.picker) {
      this.picker.open();
    }
  }

  filterDate() {

    this.selectedStatusName = '';

    let newDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');

    this.dataSource.filterPredicate = (data, filter: string) =>
      !filter || data.created_at.includes(filter);

    this.dataSource.filter = newDate!.toString().trim();

    // Update the button text based on the selected date
    const selectedDate = this.datePipe.transform(this.date, 'MMM dd, yyyy');

    if (selectedDate) {
      this.selectedDateString = selectedDate;
    }
  }

  clearFilter() {
    this.selectedStatusName = '';
    this.selectedDateString = '';

    this.dataSource.filter = '';
    this.getAllAdverts();

    this.apiData.clearFilter();
    this.apiData.clearForm();
  }

  isFilterActive(): boolean {
    return this.dataSource.filter.trim() !== '';
  }

  deleteAdvertisement(advertId: any) {
    Swal.fire({
      title: 'Are you sure you want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.apiService.deleteAdvertById(advertId).subscribe(
          () => {
            this.spinner.hide();
            this.getAllAdverts();
          },
          (error) => {
            console.error("Error soft deleting advertisement:", error);
            this.spinner.hide();
          }
        );
      }
    });
  }
  
  addAdvert() {
    this.router.navigate(["/admin/advertisement/addAdvert"]);
  }

  navigateToViewAdvertisement(advertId: number) {
    sessionStorage.setItem('currentPage', `${this.currentPage}`);
    sessionStorage.setItem('pageSize', `${this.pageSize}`);

    this.apiAdmin.getAdvertByAdvertId(advertId).subscribe(
      (data) => {
        // this.apiData.saveAdvert(data.Value.DetailDescription);
        this.apiData.setAdvertData(data.Value.DetailDescription);
        this.router.navigate(["/admin/advertisement/viewAdvert"]);
      },
      (error) => {
        console.error("Error in fetching data:", error);
      }
    );
  }

  launchAdvertLink(advert_url: any) {
    if (!advert_url.startsWith('http://') && !advert_url.startsWith('https://')) {
        advert_url = 'https://' + advert_url;
    }
    window.open(advert_url, "_blank");
  }

  editAdvertisement(advertId: number) {
    sessionStorage.setItem('currentPage', `${this.currentPage}`);
    sessionStorage.setItem('pageSize', `${this.pageSize}`);

    this.apiAdmin.getAdvertByAdvertId(advertId).subscribe(
      (data) => {
        // this.apiData.saveAdvert(data.Value.DetailDescription);
        this.apiData.setAdvertData(data.Value.DetailDescription);
        this.router.navigate(["/admin/advertisement/editAdvert"]);
      },
      (error) => {
        console.error("Error in fetching data:", error);
      }
    );
  }

  toggleStatus(advert: Advert) {
    // user.subscription = !user.subscription;
    
    
    const body = {
      advertId: advert.advertId,
      advert_caption: advert.advert_caption,
      advert_url: advert.advert_url,
      uploaded_by: advert.uploaded_by,
      isdeleted: advert.isdeleted,
      ispublished: advert.ispublished,
      created_at: advert.created_at,
    };
    
    this.updateAdvertForm(body);
  }

  updateAdvertForm(body: any) {

    this.apiService.postInsertNewAdvert(body).subscribe(
      (data: any) => {

        if (data.DetailDescription.ispublished) {
          this.showSuccessAlert('published');
        } else {
          this.showSuccessAlert('unpublished');
        }

      },
      (err) => {
        console.log("Error:", err);
        this.showUnsuccessfulAlert();
      }
    );
  }

  showSuccessAlert(message: string) {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: `You have successfully ${message} the advert.`,
      showConfirmButton: false,
      timer: 3000,
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
