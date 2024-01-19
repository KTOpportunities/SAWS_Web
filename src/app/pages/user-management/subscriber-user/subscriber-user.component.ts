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

@Component({
  selector: "app-subscriber-user",
  templateUrl: "./subscriber-user.component.html",
  styleUrls: ["./subscriber-user.component.css"],
})
export class SubscriberUserComponent implements OnInit {
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
    // Implement delete logic
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
