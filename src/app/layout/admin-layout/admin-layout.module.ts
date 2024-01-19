import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminLayoutRoutingModule } from "./admin-layout-routing.module";
import { DashboardComponent } from "src/app/pages/dashboard/dashboard.component";
import { UserManagementComponent } from "src/app/pages/user-management/user-management.component";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialogModule } from "@angular/material/dialog"; // Import MatDialogModule

import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AddUserComponent } from "src/app/pages/user-management/add-user/add-user.component";

@NgModule({
  imports: [
    AdminLayoutRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,

    ReactiveFormsModule,
    HttpClientModule, // Import MatDialogModule here
  ],
  declarations: [DashboardComponent, UserManagementComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminLayoutModule {}
