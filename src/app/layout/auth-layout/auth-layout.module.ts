import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { loginComponent } from "src/app/auth/login/login.component";
import { AuthLayoutRoutingModule } from "./auth-layout-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";
import { resetPasswordComponent } from "src/app/auth/reset-password/reset-password.component";
import { forgotPasswordComponent } from "src/app/auth/forgot-password/forgot-password.component";
import { MatIconModule } from "@angular/material/icon";
@NgModule({
  declarations: [
    loginComponent, 
    resetPasswordComponent, 
    forgotPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthLayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatIconModule
  ],
})
export class AuthLayoutModule {}
