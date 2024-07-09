import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Chart } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { SubscriberService } from "src/app/services/subscriber.service";
import { RegistrationCountComponent } from "./registration-count/registration-count.component";
import { ClickCountComponent } from "./click-count/click-count.component";
interface RegistrationData {
  UserRole: string;
  MonthString: string;
  Count: number;
}

interface UserData {
  package_name: string;
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

<<<<<<< Updated upstream
  constructor() {}

  ngOnInit(): void {}
=======
  users: UserData[] = [];
  pieChart: any;


  constructor(private subscriberService: SubscriberService) {}



  ngOnInit(): void {
    this.subscriberService.GetRegistrationsPerUserType().subscribe((data) => {
      this.registrations = data;
      console.log("test:", this.registrations);
      this.renderBarChart();
    });

    this.subscriberService.GetSubscriptionsPerPackageType().subscribe((data) => {
      this.users = data.UserSubscriptionCounts;
      console.log("User subscription data:", this.users);
      this.renderPieChart();
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

  renderPieChart(): void {
    const userTypes = this.users.map((user) => user.package_name);
    const userCounts = this.users.map((user) => user.Count);

    const total = userCounts.reduce((acc, count) => acc + count, 0); // Calculate total count

    this.pieChart = new Chart("pieChart", {
      type: "pie",
      data: {
        labels: userTypes,
        datasets: [
          {
            label: "User Types",
            data: userCounts,
            backgroundColor: [
              "rgba(255, 99, 132, 0.8)", "rgba(54, 162, 235, 0.8)", "rgba(255, 206, 86, 0.8)",
              "rgba(75, 192, 192, 0.8)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)"
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              }
            }
          },
          datalabels: {
            formatter: (value) => {
              const percentage = ((value / total) * 100).toFixed(2);
              return `${value} (${percentage}%)`;
            },
            color: '#fff',
            font: {
              weight: 'bold',
            },
          },
        },
      },
      plugins: [ChartDataLabels], // Add the plugin here
    });
  }

>>>>>>> Stashed changes
}
