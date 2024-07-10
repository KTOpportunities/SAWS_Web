import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Chart } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { SubscriberService } from "src/app/services/subscriber.service";





@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {   




  constructor(private subscriberService: SubscriberService) {}



  ngOnInit(): void {
  

 
  }


}
