import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component'; 
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
// Available options
interface NgxSpinnerConfig {
  type?: string;
}
const routes: Routes = [ {
  path: '', pathMatch :'full', redirectTo: 'login'
},
{
  path:'',
  component:AuthLayoutComponent,
  children: [
    {
      path:'',
      loadChildren: () =>
      import('./layout/auth-layout/auth-layout.module').then(
        (m) => m.AuthLayoutModule
      )
    }
  ]
},
{
  path: 'admin', component: AdminLayoutComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./layout/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
    }
  ],
  // canActivate: [AuthGuard]
},
{
  path: '**',
  redirectTo: 'login'
}
];

@NgModule({
  imports: [ CommonModule,
    BrowserModule,RouterModule.forRoot(routes, {useHash: true}),
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
