import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddAdvertisementComponent } from "src/app/pages/advertisement/add-advertisement/add-advertisement.component";
import { AdvertisementComponent } from "src/app/pages/advertisement/advertisement.component";
import { EditAdvertisementComponent } from "src/app/pages/advertisement/edit-advertisement/edit-advertisement.component";
import { ViewAdvertisementComponent } from "src/app/pages/advertisement/view-advertisement/view-advertisement.component";
import { DashboardComponent } from "src/app/pages/dashboard/dashboard.component";
import { AddResponseComponent } from "src/app/pages/feedback/add-response/add-response.component";
import { FeedbackComponent } from "src/app/pages/feedback/feedback.component";
import { ViewFeedbackComponent } from "src/app/pages/feedback/view-feedback/view-feedback.component";
import { AddUserComponent } from "src/app/pages/user-management/add-user/add-user.component";
import { AdminUserComponent } from "src/app/pages/user-management/admin-user/admin-user.component";
import { EditUserComponent } from "src/app/pages/user-management/edit-user/edit-user.component";
import { SubscriberUserComponent } from "src/app/pages/user-management/subscriber-user/subscriber-user.component";
import { UserManagementComponent } from "src/app/pages/user-management/user-management.component";

const routes: Routes = [
  // { path: "", pathMatch: "full", redirectTo: "userManagement" },
  { path: "", pathMatch: "full", redirectTo: "dashboard" },
  { path: "userManagement", component: UserManagementComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "feedback", component: FeedbackComponent },
  { path: "advertisement", component: AdvertisementComponent },
  { path: "addUser", component: AddUserComponent },
  { path: "editUser", component: EditUserComponent },
  { path: "addAdvert", component: AddAdvertisementComponent },
  { path: "editAdvert", component: EditAdvertisementComponent },
  { path: "adminUser", component: AdminUserComponent },
  { path: "subscriberUser", component: SubscriberUserComponent },
  { path: "addResponse", component: AddResponseComponent },
  { path: "viewFeeback", component: ViewFeedbackComponent },
  { path: "viewAdvert", component: ViewAdvertisementComponent },
  // {
  //   path: "user",
  //   component: UserManagementComponent,
  //   children: [
  //     { path: "", pathMatch: "full", redirectTo: "userManagement" },
  //     { path: "userManagement", component: UserManagementComponent },
  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminLayoutRoutingModule {}
