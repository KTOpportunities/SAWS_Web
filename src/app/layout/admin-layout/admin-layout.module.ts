import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  imports: [
    AdminLayoutRoutingModule,
    NgxSpinnerModule
  ],
   declarations: [DashboardComponent],
})
export class AdminLayoutModule {}
