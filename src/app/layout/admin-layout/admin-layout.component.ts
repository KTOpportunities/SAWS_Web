import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  opened: boolean = true;
  showLogout: boolean = false;
  User: any = null;

  constructor(public router: Router) {
    var stringUser = sessionStorage.getItem('User');
    if (stringUser) {
      this.User = JSON.parse(stringUser);
    }
  }

  ngOnInit() {}
  ngAfterViewInit() {}
  toggleLogout() {
    this.showLogout = !this.showLogout;
  }
  async logout() {
    await sessionStorage.removeItem('User');
    this.router.navigate(['auth/login']);
  }
}