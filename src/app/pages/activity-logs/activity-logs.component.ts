import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Dataservice } from 'src/app/services/data.service';
import { SubscriberService } from 'src/app/services/subscriber.service';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-activity-logs',
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.css']
})
export class ActivityLogsComponent implements OnInit {

  dataSource: any[] = [];
  filteredData: any[] = [];

  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;

  searchTerm = '';
  searchTimeout: any;

  displayedColumns: string[] = [
    'activityLogId',
     'fullname',
    'userrole',
    'createdby_aspnetusername',
    'activityType',
    'activityDescription',
    'created_at'
    // 'deviceType',
    // 'browserName',
   
  ];

  adminLookup: { [key: string]: any } = {};
  subscriberLookup: { [key: string]: any } = {};

  pageSizeStore = 5;
  currentPage = 0;
  currentPageStore = 0;

  constructor(
    private adminService: AdminService,
    private apiData: Dataservice,
    private router: Router,
    private apiService: SubscriberService
  ) {}

  ngOnInit(): void {
    this.loadLookupData();
    this.filterData();
  }

  /**
   * Load admins and subscribers first,
   * then load activity logs.
   */
  loadLookupData(): void {

    forkJoin({

      admins: this.adminService.GetPagedAllAdmins(1, 1000),

      subscribers: this.apiService.getPagedAllSubscribers(1, 1000)

    }).subscribe({

      next: (result) => {

        // ---------------- ADMINS ----------------

        result.admins.data.forEach((admin: any) => {

          const key =
            (admin.username || admin.email || '')
              .trim()
              .toLowerCase();

          this.adminLookup[key] = admin;

        });

        // ---------------- SUBSCRIBERS ----------------

        result.subscribers.data.forEach((subscriber: any) => {

          const key =
            (subscriber.username || subscriber.email || '')
              .trim()
              .toLowerCase();

          this.subscriberLookup[key] = subscriber;

        });

        console.log('Admin Lookup', this.adminLookup);
        console.log('Subscriber Lookup', this.subscriberLookup);

        this.loadLogs();

      },

      error: err => {
        console.error(err);
      }

    });

  }

  /**
   * Load Activity Logs
   */
  loadLogs(): void {

    this.adminService
      .GetPagedAllActivityLogs(this.pageNumber, this.pageSize)
      .subscribe({

        next: res => {

          this.dataSource = res.data.map((log: any) => {

            const username =
              (log.createdby_aspnetusername || '')
                .trim()
                .toLowerCase();

            const admin = this.adminLookup[username];
            const subscriber = this.subscriberLookup[username];

            const user = admin || subscriber;

            return {

              ...log,

              fullname: user?.fullname ?? '',

              userrole: user?.userrole ?? ''

            };

          });

          this.totalRecords = res.totalRecords;

          this.filteredData = [...this.dataSource];

          console.log(this.dataSource);

        },

        error: err => {
          console.error(err);
        }

      });

  }

  onPageChange(event: any) {

    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    this.loadLogs();

  }

  onSearch(event: any) {

    const value = event.target.value.toLowerCase();

    this.searchTerm = value;

    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {

      this.filteredData = this.dataSource.filter(row =>

        row.activityLogId?.toString().includes(value) ||

        row.activityAction?.toLowerCase().includes(value) ||

        row.activityType?.toLowerCase().includes(value) ||

        row.activityDescription?.toLowerCase().includes(value) ||

        row.createdby_aspnetusername?.toLowerCase().includes(value) ||

        row.fullname?.toLowerCase().includes(value) ||

        row.userrole?.toLowerCase().includes(value) ||

        row.deviceType?.toLowerCase().includes(value) ||

        row.browserName?.toLowerCase().includes(value)

      );

    }, 300);

  }

  exportToExcel() {

    const exportData = this.filteredData.map(row => ({

      ID: row.activityLogId,

      Action: row.activityAction,

      Type: row.activityType,

      Description: row.activityDescription,

      FullName: row.fullname,

      Role: row.userrole,

      Username: row.createdby_aspnetusername,

      Device: row.deviceType,

      Browser: row.browserName,

      Date: row.created_at

    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = {

      Sheets: {

        'Activity Logs': worksheet

      },

      SheetNames: ['Activity Logs']

    };

    XLSX.writeFile(workbook, 'activity-logs.xlsx');

  }

  addUser() {

    this.apiData.saveUserUrl('/admin/subscriberUser');

    this.router.navigate(['/admin/subscriberUser/addUser']);

  }

  filterData() {

    this.apiData.filterObservable$.subscribe((filter: string) => {

      this.searchTerm = filter.trim().toLowerCase();

      this.filteredData = this.dataSource.filter(row =>

        row.activityLogId?.toString().includes(this.searchTerm) ||

        row.activityAction?.toLowerCase().includes(this.searchTerm) ||

        row.activityType?.toLowerCase().includes(this.searchTerm) ||

        row.activityDescription?.toLowerCase().includes(this.searchTerm) ||

        row.createdby_aspnetusername?.toLowerCase().includes(this.searchTerm) ||

        row.fullname?.toLowerCase().includes(this.searchTerm) ||

        row.userrole?.toLowerCase().includes(this.searchTerm) ||

        row.deviceType?.toLowerCase().includes(this.searchTerm) ||

        row.browserName?.toLowerCase().includes(this.searchTerm)

      );

    });

  }

}