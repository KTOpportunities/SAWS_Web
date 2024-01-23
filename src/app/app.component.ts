import { Component,OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit{
  title = "Saws";
  constructor(private router: Router) {
  }
  
  ngOnInit(): void {
    // debugger
    // if (window.location.href.includes("reset-password")) {
    //   debugger;
    //   this.router.navigate(['auth/reset-password/']);
    // } else {
    //   this.router.navigate(['auth/login']);
    // }
  }
}
