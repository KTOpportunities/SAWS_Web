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
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  dataSource = new MatTableDataSource<Admin>();
  adminList: Admin[] = [];

  pageSize = 5;
  pageSizeStore = 5;
  currentPage = 0;
  currentPageStore = 0;

  TotalRecords: any = 0;
  // pageSizeOptions: number[] = [2, 2, 10, 60];

  constructor(
    private apiAdmin: AdminService,
    private apiService: SubscriberService,
    private apiData: Dataservice,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    
    this.dataSource.filterPredicate = (data, filter: string) =>
      !filter || data.created_at.includes(filter);
  }

  ngOnInit() {
  this.getAllAdmins();
    
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
          // this.dataSource.data = data.Data; // Assuming the API returns an array of objects
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;

          this.spinner.hide();
          this.adminList = data.Data;

          sessionStorage.removeItem('currentPage');
          sessionStorage.removeItem('pageSize');

          this.TotalRecords = data.TotalRecords;
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = data.TotalRecords;
        
          this.dataSource = new MatTableDataSource(this.adminList);
          this.dataSource.paginator = this.paginator;         

      },
      error: (error) => {
          console.error("Error fetching data from API:", error);
      },
    });
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

  // Add your toggle/edit/delete methods here
  toggleUser(user: any) {
    // Implement toggle logic
  }

  editUser(user: any) {
    // Implement edit logic
  }

  deleteUser(user: any) {
    debugger;
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


  navigateToEditUser(user: Admin) {
    sessionStorage.setItem('currentPage', `${this.currentPage}`);
    sessionStorage.setItem('pageSize', `${this.pageSize}`);

    this.apiData.saveUser(user);
    this.router.navigate(["/admin/editUser"]);
  }

}
