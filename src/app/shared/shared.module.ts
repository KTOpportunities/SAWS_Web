import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { AngularMaterialModule } from '../services/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [
    NavBarComponent,
    SideBarComponent,
  ],
  exports: [
    NavBarComponent,
    SideBarComponent,
  ]
})
export class SharedModule { }
