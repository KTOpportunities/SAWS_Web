import { Component } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Dataservice } from "src/app/services/data.service";
import { TokeStorageService } from "src/app/services/token-storage.service";

@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.css"],
})
export class SideBarComponent {


  isUserManagementActive = false; // Assuming you have a property to track the active state
  isDropdownOpen = false;
handleFeedbackLinkClick(event: Event): void {
  // Prevent the default behavior of the link
  event.preventDefault();
}


  // Inject the Router in the constructor
  

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiToken: TokeStorageService,
    private apiData: Dataservice,
    ) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.updateUserManagementActive();
        }
      });
    }

    updateUserManagementActive() {
      const currentUrl = this.router.url;
      this.isUserManagementActive = currentUrl.startsWith('/admin/adminUser') || currentUrl.startsWith('/admin/subscriberUser');
    }
    

  // Define a method to navigate to the specified route
  navigateToDashboard() {
    this.router.navigate(["/admin/dashboard"]);
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
  

  onOptionSelected(option: string) {
    // Implement navigation logic based on the selected option
    if (option === 'adminUser') {
      // Navigate to the Subscriber User page
      this.router.navigate(["/admin/adminUser"]);
    } else if (option === 'subscriberUser') {
      // Navigate to the Admin User page
      this.router.navigate(["/admin/subscriberUser"]);
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
  }
}
