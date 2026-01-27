import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component'; 
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SuccessComponent } from './pages/subscription/success/success.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { PayfastRedirectComponent } from './payfast-redirect/payfast-redirect.component';

// Available options
interface NgxSpinnerConfig {
  type?: string;
}
const routes: Routes = [ {
  path: '', pathMatch :'full', redirectTo: 'login'
},
  // These are used as PayFast return_url / cancel_url targets.
  // Keep them top-level so they work without authentication.
  { path: 'subscription-successful', component: PayfastRedirectComponent },
  { path: 'subscription-package', component: PayfastRedirectComponent },
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
  path: 'admin', 
  // redirectTo: 'admin',
  component: AdminLayoutComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./layout/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
    }
  ],
  canActivate: [AuthGuard]
},
{
  path: 'subscription/success', 
  component: SuccessComponent,
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
