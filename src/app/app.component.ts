import { Component,OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { TokeStorageService } from "./services/token-storage.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit{
  title = "Saws";
  isLoggedIn = false;
  constructor(
    private tokenStorage: TokeStorageService,
    private router: Router
    ) {
  }
  
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn){
      this.router.navigate(['/admin']);
    }
  }
}
