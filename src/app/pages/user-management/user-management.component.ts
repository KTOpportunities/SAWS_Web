import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { SubscriberService } from "src/app/services/subscriber.service";
import { MatDialog } from "@angular/material/dialog";
import { AddUserComponent } from "src/app/pages/user-management/add-user/add-user.component";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { EditUserComponent } from "./edit-user/edit-user.component";
import { Subscriber } from "src/app/Models/subscriber.model";
import Swal from "sweetalert2";
@Component({
  selector: "app-user-management",
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.css"],
})
export class UserManagementComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  pageSize = 5;
  pageSizeStore = 5;
  currentPage = 0;
  currentPageStore = 0;

  constructor(
    private apiService: SubscriberService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit() {
 this.getPagedAllSubscribers();
  }
  getPagedAllSubscribers(page: number = 1){
    this.apiService.getPagedAllSubscribers(this.currentPage + page, this.pageSize).subscribe(
      (data) => {
        console.log("DATA:::", data);
        this.dataSource.data = data.Data; // Assuming the API returns an array of objects
        console.log("DATA:::", this.dataSource.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
      },
      (error) => {
        console.error("Error fetching data from API:", error);
      }
    );
  }
  // Define the displayed columns
  displayedColumns: string[] = [
    "fullname",
    "email",
    "userrole",
    "created_at",
    "status",
    "action",
  ];

  dataSource = new MatTableDataSource<any>([]);

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
            this.getPagedAllSubscribers();
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

  // addUser() {
  //   this.apiData.saveUserUrl('/admin/adminUser');
  //   this.router.navigate(["/admin/addUser"]);
  // }


  navigateToEditUser(user:Subscriber) {
    sessionStorage.setItem('UserDetails', JSON.stringify(user));
    this.router.navigate(["/admin/editUser"]);
  }
}
