import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "src/app/pages/dashboard/dashboard.component";
import { AddUserComponent } from "src/app/pages/user-management/add-user/add-user.component";
import { AdminUserComponent } from "src/app/pages/user-management/admin-user/admin-user.component";
import { SubscriberUserComponent } from "src/app/pages/user-management/subscriber-user/subscriber-user.component";
import { UserManagementComponent } from "src/app/pages/user-management/user-management.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "user" },
  { path: "dashboard", component: DashboardComponent },
  { path: "addUser", component: AddUserComponent },
  { path: "adminUser", component: AdminUserComponent },
  { path: "subscriberUser", component: SubscriberUserComponent },
  {
    path: "user",
    component: UserManagementComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "userManagement" },
      { path: "userManagement", component: UserManagementComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminLayoutRoutingModule {}
