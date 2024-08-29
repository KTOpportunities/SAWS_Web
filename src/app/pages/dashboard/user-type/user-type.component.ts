import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Chart } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SubscriberService } from "src/app/services/subscriber.service";

interface SubscriptionData {
  userRole: string;
  subscriptionType: string;
  subscriptions: number;
}
@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.css']
})
export class UserTypeComponent {
  userTypes: SubscriptionData[] = [];
  totalSubscriptions: number = 0;
  pieChart: any;

  constructor(private subscriberService: SubscriberService) {}

  ngOnInit(): void {   

    this.subscriberService.GetSubscriptionsPerPackageType().subscribe((data) => {
      this.userTypes = data.userSubscriptionCounts;
      this.totalSubscriptions = data.totalCount;
      this.renderPieChart();
    });
  }
  renderPieChart(): void {
    const userTypes = this.userTypes.map((user) => user.subscriptionType);
    const userData = this.userTypes.map((user) => user.subscriptions);

    const colors = ["#016c17", "#00386c", "#f7b11d", "#98301d"];

    this.pieChart = new Chart("pieChart", {
      type: "pie",
      data: {
        labels: userTypes,
        datasets: [
          {
            label: "User Types",
            data: userData,
            backgroundColor: colors,
            borderColor: ["black"],
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
              const percentage = ((value / this.totalSubscriptions) * 100).toFixed(2);
              return `${value} (${percentage}%)`;
            },
            color: '#fff',
            font: {
              weight: 'bold',
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
}
