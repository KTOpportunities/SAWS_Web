import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserLoggedIn } from 'src/app/Models/user.model';
import { Dataservice } from 'src/app/services/data.service';
import { TokeStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {

  date: Date;
  userLoginDetails: UserLoggedIn[] = [];
  userName: any;
  userRole: any;
  searchTerm: string = '';

  showSearchSubcription!: Subscription;

  constructor(
    private apiData: Dataservice,
    private router: Router,
    public datePipe: DatePipe
  ){
    this.date = new Date();

    this.showSearchSubcription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is '/admin/dashboard'
        this.shouldShowSearchIcon();
      }
    });
  }

  ngOnInit(): void {

    // this.dataSource.filterPredicate = function (record,filter) {
    //   return true;
    // }

    var user: any = this.apiData.getCurrentUser();
    
    if(user){
      const userLoginDetails =  JSON.parse(user);
      this.userName = userLoginDetails?.aspUserName;
      this.userRole = userLoginDetails?.rolesList;
    } else {
      this.router.navigate(['/login']);
    }    
  }

  ngOnDestroy(): void {
    if(this.showSearchSubcription) {
      this.showSearchSubcription.unsubscribe();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.apiData.updateFilter(filterValue);
  }

  shouldShowSearchIcon(): boolean {
    // Check the current route
    const currentRoute = this.router.url;    

    if (currentRoute === '/admin/dashboard') {
      return false;
    } else {
      return true;
    }
  }
}