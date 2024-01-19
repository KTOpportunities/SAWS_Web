import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { forgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { resetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AuthService } from './services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    forgotPasswordComponent,
    resetPasswordComponent,
    AdminLayoutComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
