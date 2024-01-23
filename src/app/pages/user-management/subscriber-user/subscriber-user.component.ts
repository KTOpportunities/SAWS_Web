import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { SubscriberService } from "src/app/services/subscriber.service";
import { MatDialog } from "@angular/material/dialog";
import { AddUserComponent } from "src/app/pages/user-management/add-user/add-user.component";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-subscriber-user",
  templateUrl: "./subscriber-user.component.html",
  styleUrls: ["./subscriber-user.component.css"],
})
export class SubscriberUserComponent implements OnInit {
  spinner: any;
  dataSource: any;
  constructor(
    private apiService: SubscriberService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.apiService.getPagedAllSubscribers().subscribe(
      (data) => {
        console.log("DATA:::", data);
      },
      (error) => {
        console.error("Error fetching data from API:", error);
      }
    );
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
      cancelButtonText: 'No, cancel',
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
    this.dialog.open(AddUserComponent, {
      width: "100%", // adjust width as needed

      // Add more configuration options as needed
    });
  }

  navigateToAddUser() {
    this.router.navigate(["/admin/addUser"]);
  }
}
