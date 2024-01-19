import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component'; 

const routes: Routes = [
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
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
