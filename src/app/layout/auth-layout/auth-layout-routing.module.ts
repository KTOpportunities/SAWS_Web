

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginComponent } from 'src/app/auth/login/login.component';
import { forgotPasswordComponent } from 'src/app/auth/forgot-password/forgot-password.component';
import { resetPasswordComponent } from 'src/app/auth/reset-password/reset-password.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: loginComponent },
  { path: 'forgot-password', component: forgotPasswordComponent },
  { path: 'reset-password', component: resetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthLayoutRoutingModule {}
