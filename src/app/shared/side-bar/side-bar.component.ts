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

  isUserManagementActive = false;
  isDropdownOpen = false;
  selectedOption: string | null = null;   

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
    

  navigateToDashboard() {
    this.router.navigate(["/admin/dashboard"]);
  }

  navigateToAdminUser() {
    this.router.navigate(["/admin/adminUser"]);
  }

  navigateToSubscriberUser() {
    this.router.navigate(["/admin/subscriberUser"]);
  }
  navigateaTodvertisement() {
    this.router.navigate(["/admin/advertisement"]);
  }
  
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.updateUserManagementActive();
  }

  onOptionSelected(option: string) {
    
    this.selectedOption = option;

    if (option === 'Admin User') {
         this.router.navigate(["/admin/adminUser"]);
    } else if (option === 'Subscriber User') {
        this.router.navigate(["/admin/subscriberUser"]);
    }
  
    this.isDropdownOpen = false;
  }
  
  logout() {
    this.apiToken.signOut();
    this.apiData.removeCurrentUser();
    this.apiData.removeUser();
    this.apiData.removeUserUrl();
    sessionStorage.removeItem('currentPage');
    sessionStorage.removeItem('pageSize');

    this.router.navigate(['/login']);
  }

  hideDropdown() {
   this.isDropdownOpen = false;
  }
}
