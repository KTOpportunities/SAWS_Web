import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.css"],
})
export class SideBarComponent {
  // Inject the Router in the constructor
  constructor(private router: Router) {}

  // Define a method to navigate to the specified route
  navigateToDashboard() {
    this.router.navigate(["/admin/dashboard"]);
  }
  navigateToUsermanagement() {
    this.router.navigate(["/admin/user"]);
  }
  navigateToAdminUser() {
    debugger;
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
  }
}
