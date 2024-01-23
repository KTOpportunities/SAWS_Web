import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminLayoutRoutingModule } from "./admin-layout-routing.module";
import { DashboardComponent } from "src/app/pages/dashboard/dashboard.component";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AddUserComponent } from "src/app/pages/user-management/add-user/add-user.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { MatTableModule } from "@angular/material/table";

import { AngularMaterialModule } from "src/app/services/angular-material.module";
import { UserManagementComponent } from "src/app/pages/user-management/user-management.component";
@NgModule({
  imports: [AngularMaterialModule, MatTableModule],
  declarations: [DashboardComponent, UserManagementComponent],
})
export class AdminLayoutModule {}
