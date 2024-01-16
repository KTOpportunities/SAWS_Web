import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "src/app/pages/dashboard/dashboard.component";
import { UserManagementComponent } from "src/app/pages/user-management/user-management.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "user" },
  { path: "dashboard", component: DashboardComponent },
  { path: "user", component: UserManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminLayoutRoutingModule {}
