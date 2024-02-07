import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import { AdminService } from "src/app/services/admin.service";
import { MatDialog } from "@angular/material/dialog";
import { AddUserComponent } from "src/app/pages/user-management/add-user/add-user.component";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { EditUserComponent } from "../edit-user/edit-user.component";
import { Admin } from "src/app/Models/admin.model";
import Swal from "sweetalert2";
import { SubscriberService } from "src/app/services/subscriber.service";
import { Dataservice } from "src/app/services/data.service";
import { MatDatepicker, MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-admin-user",
  templateUrl: "./admin-user.component.html",
  styleUrls: ["./admin-user.component.css"]
})

export class AdminUserComponent implements OnInit {

  // Define the displayed columns
  displayedColumns: string[] = [
    "fullname",
    "email",
    "userrole",
    "created_at",
    "status",
    "action",
  ];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('picker', { static: false }) picker!: MatDatepicker<Date>;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  dataSource = new MatTableDataSource<Admin>();

  subscriptions: any[] = [
    { id: 1, subscription: true },
    { id: 2, subscription: false }
  ];

  selectedSubscription: number | undefined;
  adminList: Admin[] = [];

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

  ngOnInit() {
    this.getAllAdmins(); 
    this.filterData(); 
  }
    
  getAllAdmins(page: number = 1){

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


    this.apiAdmin.GetPagedAllAdmins(this.currentPage + page, this.pageSize).subscribe({
      next: (data: any) => {
          this.spinner.hide();
          this.adminList = data.Data;

          this.adminList.forEach(element => {
            element.subscription = false;
          });

          sessionStorage.removeItem('currentPage');
          sessionStorage.removeItem('pageSize');

          this.TotalRecords = data.TotalRecords;
     
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = data.TotalRecords;
          });
        
          this.dataSource = new MatTableDataSource(this.adminList);
          this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
          console.error("Error fetching data from API:", error);
      },
    });
 }

 selectSubscription(status: any) {
  this.selectedSubscription = status;
  this.filterSubscription();
}

 filterData() {
  this.apiData.filterObservable$.subscribe((filter: string) => {
    this.dataSource.filter = filter.trim().toLowerCase();
  });
 }

 filterSubscription() {
  this.selectedSubscriptionName = '';
  this.selectedDateString = '';

  this.dataSource.filterPredicate = (data, filter: string) =>
    !filter || data.subscription.toString().includes(filter);

  this.dataSource.filter = this.selectedSubscription!.toString().trim();

  // Update the button text based on the selected subscription status
  const selectedSubscription = this.subscriptions.find(
    (subscription) => subscription.subscription === this.selectedSubscription
  );

  if (selectedSubscription) {
    this.selectedSubscriptionName = selectedSubscription.subscription;
  }
}

 addUser() {
  this.apiData.saveUserUrl('/admin/adminUser');
  this.router.navigate(["/admin/addUser"]);
}

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getAllAdmins();

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
    this.dataSource.filter = '';
    this.selectedSubscriptionName = '';
    this.selectedDateString = '';
  }

  isFilterActive(): boolean {
    return this.dataSource.filter.trim() !== '';
  }

  // Add your toggle/edit/delete methods here
  toggleUser(user: any) {
    // Implement toggle logic
  }

  editUser(user: any) {
    // Implement edit logic
  }

  deleteUser(user: any) {
    // console.log("delete user",user);
    console.log("delete user",user.userprofileid);
    const userId = user.userprofileid; // Assuming your user object has an 'id' property
  
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
        this.apiService.deleteUserProfileById(userId).subscribe(
          () => {
            // Update the status for soft delete
            user.status = 'deleted'; // Update the status value accordingly
  
            // Optionally: Provide user feedback (toast, alert, etc.)
            console.log('User soft deleted successfully.');
  
            // Hide spinner after soft deletion
            this.spinner.hide();
            this.getAllAdmins();
          },
          (error) => {
            console.error("Error soft deleting user:", error);
  
            // Optionally: Provide user feedback on error
            alert('Error soft deleting user. Please try again.');
  
            // Hide spinner on error
            this.spinner.hide();
          }
        );
      }
    });
  }
  
  openPopup() {
    this.dialog.open(EditUserComponent, {
      width: "49%",
      height: "52%", // adjust width as needed

      // Add more configuration options as needed
    });
  }

  navigateToAddUser() {
    this.router.navigate(["/admin/addUser"]);
  }

  toggleStatus(user: Admin) {
    user.subscription = !user.subscription;
  }

  navigateToEditUser(user: Admin) {
    sessionStorage.setItem('currentPage', `${this.currentPage}`);
    sessionStorage.setItem('pageSize', `${this.pageSize}`);

    this.apiData.saveUser(user);
    this.router.navigate(["/admin/editUser"]);
  }

}
