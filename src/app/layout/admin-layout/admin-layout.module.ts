import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminLayoutRoutingModule } from "./admin-layout-routing.module";
import { DashboardComponent } from "src/app/pages/dashboard/dashboard.component";
import { UserManagementComponent } from "src/app/pages/user-management/user-management.component";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  imports: [AdminLayoutRoutingModule,  MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
  ],
  declarations: [DashboardComponent, UserManagementComponent],
})
export class AdminLayoutModule {}
