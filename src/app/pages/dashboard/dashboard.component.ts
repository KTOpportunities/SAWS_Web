import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Chart } from "chart.js";
import { SubscriberService } from "src/app/services/subscriber.service";
import { RegistrationCountComponent } from "./registration-count/registration-count.component";
import { ClickCountComponent } from "./click-count/click-count.component";
interface RegistrationData {
  UserRole: string;
  MonthString: string;
  Count: number;
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  registrations: RegistrationData[] = [];
  barChart: any;

  constructor() {}

  ngOnInit(): void {}
}
