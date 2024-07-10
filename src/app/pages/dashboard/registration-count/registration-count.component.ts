import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Chart } from "chart.js";
import { SubscriberService } from "src/app/services/subscriber.service";

interface RegistrationData {
  UserRole: string;
  MonthString: string;
  Subscriptions: number;
}

@Component({
  selector: "app-registration-count",
  templateUrl: "./registration-count.component.html",
  styleUrls: ["./registration-count.component.css"],
})
export class RegistrationCountComponent implements OnInit {
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

    const monthCounts = new Array(12).fill(0);

    this.registrations.forEach((entry) => {
      const monthIndex = months.indexOf(entry.MonthString);
      if (monthIndex !== -1) {
        monthCounts[monthIndex] += entry.Subscriptions;
      }
    });

    this.barChart = new Chart("barChart", {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            data: monthCounts,
            backgroundColor: [
              "rgba(255, 0, 0, 0.8)",
              "rgba(0, 128, 0, 0.8)",
              "rgba(0, 0, 255, 0.8)",
              "rgba(255, 165, 0, 0.8)",
              "rgba(255, 255, 0, 0.8)",
              "rgba(128, 0, 128, 0.8)",
              "rgba(0, 255, 255, 0.8)",
              "rgba(128, 0, 0, 0.8)",
              "rgba(255, 0, 255, 0.8)",
              "rgba(0, 255, 0, 0.8)",
              "rgba(0, 0, 128, 0.8)",
              "rgba(255, 218, 185, 0.8)",
            ],
            borderColor: [
              "rgba(255, 0, 0, 1)",
              "rgba(0, 128, 0, 1)",
              "rgba(0, 0, 255, 1)",
              "rgba(255, 165, 0, 1)",
              "rgba(255, 255, 0, 1)",
              "rgba(128, 0, 128, 1)",
              "rgba(0, 255, 255, 1)",
              "rgba(128, 0, 0, 1)",
              "rgba(255, 0, 255, 1)",
              "rgba(0, 255, 0, 1)",
              "rgba(0, 0, 128, 1)",
              "rgba(255, 218, 185, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Months",
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: "Number Of Registration",
            },
          },
        },
      },
    });
  }
}
