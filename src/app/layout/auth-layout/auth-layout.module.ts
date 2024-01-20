import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loginComponent } from 'src/app/auth/login/login.component';
import { AuthLayoutRoutingModule } from './auth-layout-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  declarations: [loginComponent],
  imports: [
    CommonModule,
    AuthLayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
})
export class AuthLayoutModule {}