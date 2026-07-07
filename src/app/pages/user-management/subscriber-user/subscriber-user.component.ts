import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { SubscriberService } from "src/app/services/subscriber.service";
import { MatDialog } from "@angular/material/dialog";
import { AddUserComponent } from "src/app/pages/user-management/add-user/add-user.component";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { EditUserComponent } from "../edit-user/edit-user.component";
import { Subscriber } from "src/app/Models/subscriber.model";
import Swal from "sweetalert2";
import { Dataservice } from "src/app/services/data.service";
import { DatePipe } from "@angular/common";
import { MatDatepicker, MatDatepickerInputEvent } from "@angular/material/datepicker";

@Component({
  selector: "app-subscriber-user",
  templateUrl: "./subscriber-user.component.html",
  styleUrls: ["./subscriber-user.component.css"],
})

export class SubscriberUserComponent implements OnInit {

  displayedColumns: string[] = [
    "fullname",
    "email",
    "created_at",
    "userrole",
    "status",
    "package",
    "action",
  ];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('picker', { static: false }) picker!: MatDatepicker<Date>;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  dataSource = new MatTableDataSource<Subscriber>();

  statuses: any[] = [
    { id: 1, isactive: true },
    { id: 2, isactive: false },
  ];

  subsciberList: Subscriber[] = [];

  pageSize = 5;
  pageSizeStore = 5;
  currentPage = 0;
  currentPageStore = 0;

  TotalRecords: any = 0;

  selectedDateString: any;
  selectedIsActiveString: string = "";
  date: Date;

  constructor(
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
      this.getAllSubscribers();
      this.filterData()
    }
      
    getAllSubscribers(page: number = 1){

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


    this.apiService.getPagedAllSubscribers(this.currentPage + page, this.pageSize).subscribe({
      next: (response: any) => {
          this.spinner.hide();
          this.subsciberList = response.data;
          console.log("Data fetched from API:", response);
          sessionStorage.removeItem('currentPage');
          sessionStorage.removeItem('pageSize');

          this.TotalRecords = response.totalRecords;

          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = response.totalRecords;
          });
        
          this.dataSource = new MatTableDataSource(this.subsciberList);
          this.dataSource.paginator = this.paginator;         

      },
      error: (error) => {
          console.error("Error fetching data from API:", error);
      },
    });
 }

 selectIsActive(status: any) {
  this.selectedIsActiveString = status;
  this.filterIsActive();
}

 filterData() {
  this.apiData.filterObservable$.subscribe((filter: string) => {
    this.dataSource.filter = filter.trim().toLowerCase();
  });
 }

 filterIsActive() {
  this.selectedDateString = "";

  this.dataSource.filterPredicate = (data, filter: string) => {
    return !filter || data.isactive.toString() === filter;
  };

  this.dataSource.filter = this.selectedIsActiveString!.toString().trim();

  this.selectedIsActiveString = this.selectedIsActiveString ? "Active" : "Inactive";
}

clearFilter() {
  this.selectedIsActiveString = "";
  this.selectedDateString = '';

  this.dataSource.filter = '';

  this.getAllSubscribers();

  this.apiData.clearFilter();
  this.apiData.clearForm();
}

isFilterActive(): boolean {
  return this.dataSource.filter.trim() !== '';
}

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    
    this.getAllSubscribers();
    
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
      let newDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
  
      this.dataSource.filterPredicate = (data, filter: string) =>
        !filter || data.created_at.includes(filter);
  
      this.dataSource.filter = newDate!.toString().trim();
  
      const selectedDate = this.datePipe.transform(this.date, 'MMM dd, yyyy');
  
      if (selectedDate) {
        this.selectedDateString = selectedDate;
      }
  }
 
  deleteUser(user: any) {   
    const userId = user.userprofileid; 

    Swal.fire({
      title: 'Are you sure you want to delete user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show(); 

        // Call the soft delete API
        this.apiService.deleteUserProfileById(userId).subscribe(
          (response: any) => {
            if(response.success){
              this.showSuccessAlert();
              this.getAllSubscribers();
            } else {
              this.showFailedAlert();
            }
            this.spinner.hide();
          },
          (error) => {
            console.error("Error deleting user:", error);
            this.spinner.hide();
            this.showFailedAlert();
          }
        );
      }
    });
  }

  showSuccessAlert() {
    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "You have successfully deleted the user",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  showFailedAlert() {
    Swal.fire({
      icon: "success",
      title: "Failed!",
      text: "Deletion of user not successful",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  addUser() {
    this.apiData.saveUserUrl('/admin/subscriberUser');
    this.router.navigate(["/admin/subscriberUser/addUser"]);
  }

  navigateToEditUser(user: Subscriber) {
    sessionStorage.setItem('currentPage', `${this.currentPage}`);
    sessionStorage.setItem('pageSize', `${this.pageSize}`);
    
    this.apiData.saveUserUrl('/admin/subscriberUser');
    this.apiData.saveUser(user)
    this.router.navigate(["/admin/subscriberUser/editUser"]);
  }
}