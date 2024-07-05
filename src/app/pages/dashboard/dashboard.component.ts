import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Chart } from "chart.js";
import { SubscriberService } from "src/app/services/subscriber.service";

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

  constructor(private subscriberService: SubscriberService) {}

  ngOnInit(): void {
    this.subscriberService.GetRegistrationsPerUserType().subscribe((data) => {
      this.registrations = data;
      console.log("test:", this.registrations);
      this.renderBarChart();
    });
  }

  renderBarChart(): void {
    // Define the order of months
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Create an array to hold the counts for each month
    const monthCounts = new Array(12).fill(0);

    // Sum the counts for each month
    this.registrations.forEach((entry) => {
      const monthIndex = months.indexOf(entry.MonthString);
      if (monthIndex !== -1) {
        monthCounts[monthIndex] += entry.Count;
      }
    });

    this.barChart = new Chart("barChart", {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Registrations per Month",
            data: monthCounts,
            backgroundColor: [
              "rgba(255, 0, 0, 0.8)", // Red
              "rgba(0, 128, 0, 0.8)", // Green
              "rgba(0, 0, 255, 0.8)", // Blue
              "rgba(255, 165, 0, 0.8)", // Orange
              "rgba(255, 255, 0, 0.8)", // Yellow
              "rgba(128, 0, 128, 0.8)", // Purple
              "rgba(0, 255, 255, 0.8)", // Cyan
              "rgba(128, 0, 0, 0.8)", // Maroon
              "rgba(255, 0, 255, 0.8)", // Magenta
              "rgba(0, 255, 0, 0.8)", // Lime Green
              "rgba(0, 0, 128, 0.8)", // Navy Blue
              "rgba(255, 218, 185, 0.8)", // Peach
            ],
            borderColor: [
              "rgba(255, 0, 0, 1)", // Red
              "rgba(0, 128, 0, 1)", // Green
              "rgba(0, 0, 255, 1)", // Blue
              "rgba(255, 165, 0, 1)", // Orange
              "rgba(255, 255, 0, 1)", // Yellow
              "rgba(128, 0, 128, 1)", // Purple
              "rgba(0, 255, 255, 1)", // Cyan
              "rgba(128, 0, 0, 1)", // Maroon
              "rgba(255, 0, 255, 1)", // Magenta
              "rgba(0, 255, 0, 1)", // Lime Green
              "rgba(0, 0, 128, 1)", // Navy Blue
              "rgba(255, 218, 185, 1)", // Peach
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }
}
