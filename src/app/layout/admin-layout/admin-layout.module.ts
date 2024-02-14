import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminLayoutRoutingModule } from "./admin-layout-routing.module";
import { DashboardComponent } from "src/app/pages/dashboard/dashboard.component";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AddUserComponent } from "src/app/pages/user-management/add-user/add-user.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";
import { AngularMaterialModule } from "src/app/services/angular-material.module";
import { UserManagementComponent } from "src/app/pages/user-management/user-management.component";
import { FormsModule } from "@angular/forms";
import { EditUserComponent } from "src/app/pages/user-management/edit-user/edit-user.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SubscriberUserComponent } from "src/app/pages/user-management/subscriber-user/subscriber-user.component";
import { AdminUserComponent } from "src/app/pages/user-management/admin-user/admin-user.component";
import { FeedbackComponent } from "src/app/pages/feedback/feedback.component";
import { AddResponseComponent } from "src/app/pages/feedback/add-response/add-response.component";
import { ViewFeedbackComponent } from "src/app/pages/feedback/view-feedback/view-feedback.component";
@NgModule({
  declarations: [
    UserManagementComponent,
    DashboardComponent,
    SubscriberUserComponent,
    AddUserComponent,
    EditUserComponent,
    AdminUserComponent,
    FeedbackComponent,
    AddResponseComponent,
    ViewFeedbackComponent
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    HttpClientModule,
    HttpClientModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatTableModule,
    MatDialogModule,
    FormsModule,
    FlexLayoutModule
  ],
})
export class AdminLayoutModule {}
