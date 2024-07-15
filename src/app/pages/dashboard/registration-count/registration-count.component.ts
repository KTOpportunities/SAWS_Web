import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Chart } from "chart.js";
import { SubscriberService } from "src/app/services/subscriber.service";

interface UserType {
  userrole: string;
  SubscriptionType: string;
  Registrations: number;
}

interface RegistrationData {
  MonthString: string;
  Month: number;
  Year: number;
  UserTypes: UserType[];
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

    const userRoles = Array.from(
      new Set(
        this.registrations.flatMap((reg) =>
          reg.UserTypes.map((user) => user.userrole)
        )
      )
    );
    const monthRoleCounts = userRoles.map((role) => new Array(12).fill(0));

    this.registrations.forEach((entry) => {
      const monthIndex = entry.Month - 1; // Month is 1-based in data
      entry.UserTypes.forEach((userType) => {
        const roleIndex = userRoles.indexOf(userType.userrole);
        if (roleIndex !== -1) {
          monthRoleCounts[roleIndex][monthIndex] += userType.Registrations;
        }
      });
    });

    const colors = ["#00386c", "#008c1d"]; // Blue and Gold

    this.barChart = new Chart("barChart", {
      type: "bar",
      data: {
        labels: months,
        datasets: userRoles.map((role, index) => ({
          label: role,
          data: monthRoleCounts[index],
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
          borderWidth: 1,
        })),
      },
      options: {
        plugins: {
          legend: {
            display: true,
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
              text: "Number Of Registrations",
            },
          },
        },
      },
    });
  }
}
