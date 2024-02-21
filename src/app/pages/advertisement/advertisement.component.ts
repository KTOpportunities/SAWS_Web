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
import { Feedback } from 'src/app/Models/Feedback';

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
    "advert_link",
    "action",
  ];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('picker', { static: false }) picker!: MatDatepicker<Date>;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  dataSource = new MatTableDataSource<Feedback>();
  selection = new SelectionModel<Feedback>(true, []);

  selectedSubscription: number | undefined;
  feedbackList: Feedback[] = [];

  pageSize = 5;
  pageSizeStore = 5;
  currentPage = 0;
  currentPageStore = 0;
  
  TotalRecords: any = 0;
  filteredData: any = '';

  selectedDateString: any;
  selectedSubscriptionName: any = '';
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
    this.getAllFeedbacks(); 
    this.filterData(); 
  }

  getAllFeedbacks(page: number = 1){

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


    this.apiAdmin.GetPagedAllFeedbacks(this.currentPage + page, this.pageSize).subscribe({
      next: (data: any) => {
          this.spinner.hide();
          this.feedbackList = data.Data;

          sessionStorage.removeItem('currentPage');
          sessionStorage.removeItem('pageSize');

          this.TotalRecords = data.TotalRecords;
     
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = data.TotalRecords;
          });
        
          this.dataSource = new MatTableDataSource(this.feedbackList);
          this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
          console.error("Error fetching data from API:", error);
      },
    });
 }

isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
}

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

 selectSubscription(status: any) {
  this.selectedSubscription = status;
  // this.filterSubscription();
}

 filterData() {
  this.apiData.filterObservable$.subscribe((filter: string) => {
    this.dataSource.filter = filter.trim().toLowerCase();
  });
 }

//  filterSubscription() {
//     this.selectedSubscriptionName = '';
//     this.selectedDateString = '';

//     this.dataSource.filterPredicate = (data, filter: string) =>
//       !filter || data.subscription.toString().includes(filter);

//     this.dataSource.filter = this.selectedSubscription!.toString().trim();

//     // Update the button text based on the selected subscription status
//     const selectedSubscription = this.subscriptions.find(
//       (subscription) => subscription.subscription === this.selectedSubscription
//     );

//     if (selectedSubscription) {
//       this.selectedSubscriptionName = selectedSubscription.subscription;
//     }
//   }



  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getAllFeedbacks();

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
    console.log('picked')
    if (this.picker) {
      this.picker.open();
    }
  }

  filterDate() {
    // this.selectedProvinceName = '';
    // this.selectedStatusName = '';
    // this.selectedPositionName = '';

    this.selectedSubscriptionName = '';

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
    // this.dataSource.filter = '';
    this.selectedSubscriptionName = '';
    this.selectedDateString = '';

    this.apiData.clearFilter();
    this.apiData.clearForm();
  }

  isFilterActive(): boolean {
    return this.dataSource.filter.trim() !== '';
  }


  deleteAdvertisement(user: any) {
    const userId = user.userprofileid; 
    const aspuId = user.aspuid;
  
    Swal.fire({
      title: 'Are you sure you want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show(); // Show spinner while deleting
  
        // Call the soft delete API
        this.apiService.deleteUserProfileById(userId, aspuId).subscribe(
          () => {
             user.status = 'deleted'; 
            this.spinner.hide();
            this.getAllFeedbacks();
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

  navigateToViewAdvertisement(user: Admin) {
    sessionStorage.setItem('currentPage', `${this.currentPage}`);
    sessionStorage.setItem('pageSize', `${this.pageSize}`);

    this.apiData.saveAdvert(user);
    this.router.navigate(["/admin/advertisement/viewAdvert"]);
  }

  editAdvertisement(user: Admin) {
    sessionStorage.setItem('currentPage', `${this.currentPage}`);
    sessionStorage.setItem('pageSize', `${this.pageSize}`);

    this.apiData.saveAdvert(user);
    this.router.navigate(["/admin/advertisement/editAdvert"]);
  }

}
