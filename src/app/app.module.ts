import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component";
import { forgotPasswordComponent } from "./auth/forgot-password/forgot-password.component";
import { resetPasswordComponent } from "./auth/reset-password/reset-password.component";
import { AdminLayoutComponent } from "./layout/admin-layout/admin-layout.component";
import { AuthService } from "./services/auth.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { SideBarComponent } from "./shared/side-bar/side-bar.component";
import { NavBarComponent } from "./shared/nav-bar/nav-bar.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatPaginatorModule } from "@angular/material/paginator";
import { AddUserComponent } from "./pages/user-management/add-user/add-user.component";
import { AdminUserComponent } from "./pages/user-management/admin-user/admin-user.component";
import { SubscriberUserComponent } from "./pages/user-management/subscriber-user/subscriber-user.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";
import { DataService } from "./services/data.service";

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    forgotPasswordComponent,
    resetPasswordComponent,
    AdminLayoutComponent,
    SideBarComponent,
    NavBarComponent,
    AddUserComponent,
    AdminUserComponent,
    SubscriberUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    NgxSpinnerModule
    
  ],
  providers: [
    AuthService, 
    DataService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
