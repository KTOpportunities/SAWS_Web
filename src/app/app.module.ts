import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component";
import { AdminLayoutComponent } from "./layout/admin-layout/admin-layout.component";
import { AuthService } from "./services/auth.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { DatePipe } from '@angular/common';
// import { SideBarComponent } from "./shared/side-bar/side-bar.component";
// import { NavBarComponent } from "./shared/nav-bar/nav-bar.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatPaginatorModule } from "@angular/material/paginator";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";
import { TokeninterceptorService } from "./services/token.interceptor";
import { SubscriberService } from "./services/subscriber.service";
import { Dataservice } from "./services/data.service";
import { MatTableModule } from "@angular/material/table";
import { SharedModule } from "./shared/shared.module"
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminService } from "./services/admin.service";
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    AdminLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatTableModule,
    SharedModule,
    FlexLayoutModule,
    MatIconModule
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokeninterceptorService,
      multi: true,
    },
    SubscriberService,
    AdminService,
    Dataservice,
    AuthService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
