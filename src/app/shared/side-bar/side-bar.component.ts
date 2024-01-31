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
  // Inject the Router in the constructor
  isUserManagementActive: boolean = false;

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

  onOptionSelected(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    switch (selectedValue) {
      case "adminUser":
        this.navigateToAdminUser();
        break;
      case "subscriberUser":
        this.navigateToSubscriberUser();
        break;
      default:
        // Handle default case if needed
        break;
    }

    this.updateUserManagementActive();
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
