import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Chart } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SubscriberService } from "src/app/services/subscriber.service";


interface UserData {
  package_name: string;
  Users: number;
}
@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.css']
})
export class UserTypeComponent {
  users: UserData[] = [];
  pieChart: any;


  constructor(private subscriberService: SubscriberService) {}



  ngOnInit(): void {
   

    this.subscriberService.GetSubscriptionsPerPackageType().subscribe((data) => {
      this.users = data.UserSubscriptionCounts;
      console.log("User subscription data:", this.users);
      this.renderPieChart();
    });
  }
  renderPieChart(): void {
    const userTypes = this.users.map((user) => user.package_name);
    const userCounts = this.users.map((user) => user.Users);

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
}
