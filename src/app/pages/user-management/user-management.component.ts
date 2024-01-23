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
import { Subscriber } from "src/app/models/subscriber.model";
@Component({
  selector: "app-user-management",
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.css"],
})
export class UserManagementComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private apiService: SubscriberService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit() {
    this.apiService.getPagedAllSubscribers().subscribe(
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
    // Implement delete logic
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


  navigateToEditUser(user:Subscriber) {
    sessionStorage.setItem('SubscriberDetails', JSON.stringify(user));
    this.router.navigate(["/admin/editUser"]);
  }
}
