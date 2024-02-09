import { DatePipe } from '@angular/common';
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
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

  isUserManagementActive = false;
  isDropdownOpen = false;
  selectedOption: string | null = null;
  menuOpen: boolean = false;

  constructor(
    private apiData: Dataservice,
    private router: Router,
    public datePipe: DatePipe,
    private apiToken: TokeStorageService,
    private elementRef: ElementRef
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

    if (currentRoute !== '/admin/subscriberUser' && currentRoute !== '/admin/adminUser' ) {
      return false;
    } else {
      return true;
    }
  }

  updateUserManagementActive() {
    const currentUrl = this.router.url;
    this.isUserManagementActive = currentUrl.startsWith('/admin/adminUser') || currentUrl.startsWith('/admin/subscriberUser');
  }
  

  // Define a method to navigate to the specified route
  navigateToDashboard() {
    this.router.navigate(["/admin/dashboard"]);
    this.menuOpen = false;
  }

  // navigateToUsermanagement() {
  //   this.router.navigate(["/admin/user"]);
  //   this.router.navigate(["/admin/userManagement"]);
  // }

  navigateToAdminUser() {
    this.router.navigate(["/admin/adminUser"]);
  }

  navigateToSubscriberUser() {
    this.router.navigate(["/admin/subscriberUser"]);
  }

  toggleDropdown() {
    console.log('Toggling dropdown');
    this.isDropdownOpen = !this.isDropdownOpen;
    this.updateUserManagementActive();
  }

  handleFeedbackLinkClick(event: Event): void {
    // Prevent the default behavior of the link
    this.menuOpen = false;
    event.preventDefault();
  }

  onOptionSelected(option: string) {
    
    this.selectedOption = option;// Set the selected user type

    // Implement navigation logic based on the selected option
    if (option === 'Admin User') {
      // Navigate to the Subscriber User page
      this.router.navigate(["/admin/adminUser"]);
      this.menuOpen = false;
    } else if (option === 'Subscriber User') {
      // Navigate to the Admin User page
      this.router.navigate(["/admin/subscriberUser"]);
      this.menuOpen = false;
    }
    // Close the dropdown if needed
    this.isDropdownOpen = false;
  }

  logout() {
    this.apiToken.signOut();
    this.apiData.removeCurrentUser();
    this.apiData.removeUser();
    this.apiData.removeUserUrl();
    sessionStorage.removeItem('currentPage');
    sessionStorage.removeItem('pageSize');
    this.menuOpen = false;
  }

  hideDropdown() {
  this.isDropdownOpen = false;
  }
}