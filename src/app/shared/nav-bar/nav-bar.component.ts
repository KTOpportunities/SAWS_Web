import { DatePipe } from '@angular/common';
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  userEmail: any;
  userRole: any;
  searchTerm: string = '';

  myForm!: FormGroup;

  showSearchSubcription!: Subscription;

  isUserManagementActive = false;
  isDropdownOpen = false;
  selectedOption: string | null = null;
  menuOpen: boolean = false;

  constructor(
    public apiData: Dataservice,
    private router: Router,
    public datePipe: DatePipe,
    private apiToken: TokeStorageService,
    private elementRef: ElementRef,
    private fb: FormBuilder
  ){
    this.date = new Date();

    this.showSearchSubcription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is '/admin/dashboard'
        this.shouldShowSearchIcon();
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateUserManagementActive();
      }
    });
  }

  ngOnInit(): void {

    var user: any = this.apiData.getCurrentUser();
    
    if(user){
      const userLoginDetails =  JSON.parse(user);
      this.userName = userLoginDetails?.userName;
      this.userEmail = userLoginDetails?.userEmail;
      this.userRole = userLoginDetails?.userRole;
    } else {
      this.router.navigate(['/login']);
    }

    this.myForm = this.fb.group({
      search: ['']
    });

    this.apiData.setForm(this.myForm);    
  }

  ngOnDestroy(): void {
    if(this.showSearchSubcription) {
      this.showSearchSubcription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth > 991) {
      this.menuOpen = false;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.apiData.updateFilter(filterValue);
  }

  shouldShowSearchIcon(): boolean {
    // Check the current route
    const currentRoute = this.router.url; 
    
    const excludedRoutes: string[] = ['/admin/subscriberUser', '/admin/adminUser', '/admin/feedback', '/admin/advertisement', '/admin/feedback/broadcast', '/admin/feedback/broadcast/listBroadcasts'];

    if (!excludedRoutes.includes(currentRoute)) 
    {
      return false;
    } else {
      return true;
    }
  }

  updateUserManagementActive() {
    const currentUrl = this.router.url;
    this.isUserManagementActive = currentUrl.startsWith('/admin/adminUser') || currentUrl.startsWith('/admin/subscriberUser');
  }  

  navigateToDashboard() {
    this.router.navigate(["/admin/dashboard"]);
    this.menuOpen = false;
  }

  navigateToAdminUser() {
    this.router.navigate(["/admin/adminUser"]);
  }

  navigateToSubscriberUser() {
    this.router.navigate(["/admin/subscriberUser"]);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.updateUserManagementActive();
  }

  onOptionSelected(option: string) {
    
    this.selectedOption = option;

       if (option === 'Admin User') {
           this.router.navigate(["/admin/adminUser"]);
      this.menuOpen = false;
    } else if (option === 'Subscriber User') {
    
      this.router.navigate(["/admin/subscriberUser"]);
      this.menuOpen = false;
    }
  
    this.isDropdownOpen = false;
  }

  logout() {
    this.apiToken.signOut();
    this.apiData.removeCurrentUser();
    this.apiData.removeUser();
    this.apiData.removeAdvert();
    this.apiData.removeUserUrl();
    sessionStorage.removeItem('currentPage');
    sessionStorage.removeItem('pageSize');
    this.menuOpen = false;

    this.router.navigate(['/login']);
  }

  hideDropdown() {
  this.isDropdownOpen = false;
  this.menuOpen = false;
  }
}