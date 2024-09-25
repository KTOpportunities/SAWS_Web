import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
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

  ngOnInit() {
    let currentPath = sessionStorage.getItem("currentPath");
    debugger;
    if(currentPath != "undefined"){
      this.router.navigate(['/admin/'+currentPath]);
    }
  }
  ngAfterViewInit() {}
  toggleLogout() {
    this.showLogout = !this.showLogout;
  }
  async logout() {
    await sessionStorage.removeItem('User');
    this.router.navigate(['/login']);
  }
}