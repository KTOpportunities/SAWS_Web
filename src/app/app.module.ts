import { NgModule } from "@angular/core";
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from "@angular/material/paginator";

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    forgotPasswordComponent,
    resetPasswordComponent,
    AdminLayoutComponent,
    SideBarComponent,
    NavBarComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule,MatPaginatorModule],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
