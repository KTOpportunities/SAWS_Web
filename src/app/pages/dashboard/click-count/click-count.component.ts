import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Chart } from "chart.js";
import { SubscriberService } from "src/app/services/subscriber.service";

interface ClickData {
  monthString: string;
  clicks: number;
}

@Component({
  selector: "app-click-count",
  templateUrl: "./click-count.component.html",
  styleUrls: ["./click-count.component.css"],
})
export class ClickCountComponent {
  clicks: ClickData[] = [];
  barChart: any;

  constructor(private subscriberService: SubscriberService) {}

  ngOnInit(): void {
    this.subscriberService.GetAdvertsClickPerMonth().subscribe((data) => {
      this.clicks = data;
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
    this.clicks.forEach((entry) => {
      const monthIndex = months.indexOf(entry.monthString);
      if (monthIndex !== -1) {
        monthCounts[monthIndex] += entry.clicks;
      }
    });

    this.barChart = new Chart("barClickChart", {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            data: monthCounts,
            backgroundColor: [
              "#00386c",
              "#008c1d",
              "rgba(0, 0, 255, 0.8)",
              "rgba(255, 165, 0, 0.8)",
              "rgba(255, 255, 0, 0.8)",
              "rgba(128, 0, 128, 0.8)",
              "  #00386c",
              "#008c1d",
              "rgba(128, 0, 0, 0.8)",
              "rgba(255, 0, 255, 0.8)",
              "rgba(0, 255, 0, 0.8)",
              "rgba(0, 0, 128, 0.8)",
              "rgba(255, 218, 185, 0.8)",
            ],
            borderColor: [
              "#00386c",
              "#008c1d",
              "rgba(0, 0, 255, 0.8)",
              "rgba(255, 165, 0, 0.8)",
              "rgba(255, 255, 0, 0.8)",
              "rgba(128, 0, 128, 0.8)",
              "  #00386c",
              "#008c1d",
              "rgba(128, 0, 0, 0.8)",
              "rgba(255, 0, 255, 0.8)",
              "rgba(0, 255, 0, 0.8)",
              "rgba(0, 0, 128, 0.8)",
              "rgba(255, 218, 185, 0.8)",
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
              text: "# of Clicks",
            },
          },
        },
      },
    });
  }
}
