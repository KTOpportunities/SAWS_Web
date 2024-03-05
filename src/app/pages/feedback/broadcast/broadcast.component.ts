import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Admin } from 'src/app/Models/admin.model';
import { AdminService } from 'src/app/services/admin.service';
import { Dataservice } from 'src/app/services/data.service';
import { SubscriberService } from 'src/app/services/subscriber.service';
import Swal from 'sweetalert2';
import { Feedback } from 'src/app/Models/Feedback';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.css']
})
export class BroadcastComponent implements OnInit{

    // Define the displayed columns
    displayedColumns: string[] = [
      "select",
      "fullname",
      "email",
      "created_at",
      // "status",
      // "action",
    ];
  
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    // @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild('picker', { static: false }) picker!: MatDatepicker<Date>;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;
  
    dataSource = new MatTableDataSource<Feedback>();
    selection = new SelectionModel<Feedback>(true, []);

    statuses: any[] = [
      { id: 1, status: true, name: "Responded" },
      { id: 2, status: false, name: "Unanswered" }
    ];
  
    selectedStatus: number | undefined;
    feedbackList: Feedback[] = [];
  
    pageSize = 5;
    pageSizeStore = 5;
    currentPage = 0;
    currentPageStore = 0;
    
    TotalRecords: any = 0;
    filteredData: any = '';
  
    selectedDateString: any;
    selectedStatusName: any = '';
    date: Date;

  constructor(
    private apiAdmin: AdminService,
    private apiService: SubscriberService,
    private apiData: Dataservice,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
  ) {
    
    this.dataSource.filterPredicate = (data, filter: string) =>
      !filter || data.created_at.includes(filter);

    this.date = new Date();
  }

  ngOnInit(): void {
    this.getAllFeedbacksByUniqueEmail(); 
    this.filterData();
  }

  getAllFeedbacksByUniqueEmail(page: number = 1){

    var currentPage: number = Number(sessionStorage.getItem('currentPage_1'));
    var pageSize: number = Number(sessionStorage.getItem('pageSize_1'));

    if (currentPage == 0) {
      currentPage = this.currentPage;
    } else {
      this.currentPage = currentPage
    }
    
    if (pageSize == 0) {
      pageSize = this.pageSize;
    } else {
      this.pageSize = pageSize;
    }


    this.apiAdmin.getPagedAllFeedbacksByUniqueEmail(this.currentPage + page, this.pageSize).subscribe({
      next: (data: any) => {
          this.feedbackList = data.Data;

          sessionStorage.removeItem('currentPage_1');
          sessionStorage.removeItem('pageSize_1');

          this.TotalRecords = data.TotalRecords;
     
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = data.TotalRecords;
          });
        
          this.dataSource = new MatTableDataSource(this.feedbackList);
          this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
          console.error("Error fetching data from API:", error);
      },
    });
 }

  isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected == numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  selectStatus(status: any) {
  this.selectedStatus = status;
  this.filterStatus();
}

 filterData() {
  this.apiData.filterObservable$.subscribe((filter: string) => {
    this.dataSource.filter = filter.trim().toLowerCase();
  });
 }

 filterStatus() {
  this.selectedStatusName = '';
  this.selectedDateString = '';

  this.dataSource.filterPredicate = (data, filter: string) =>
    !filter || data.isresponded.toString().includes(filter);

  this.dataSource.filter = this.selectedStatus!.toString().trim();

  // Update the button text based on the selected subscription status
  const selectedStatus = this.statuses.find(
    (status) => status.status === this.selectedStatus
  );

  if (selectedStatus) {
    this.selectedStatusName = selectedStatus.name;
  }
}

pageChanged(event: PageEvent) {
  this.pageSize = event.pageSize;
  this.currentPage = event.pageIndex;
  
  this.getAllFeedbacksByUniqueEmail();
  
  if (this.dataSource) {
    this.dataSource.filterPredicate = (data: any, filter: string) =>
    data.name.indexOf(filter) || data.Status.indexOf(filter) != -1;
  }
}

selectDate(type: string, event: MatDatepickerInputEvent<Date>) {
  this.date = event.value!;
  this.filterDate();
}

openPicker() {
  if (this.picker) {
    this.picker.open();
  }
}

filterDate() {
  
  this.selectedStatusName = '';
  
  let newDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
  
  this.dataSource.filterPredicate = (data, filter: string) =>
  !filter || data.created_at.includes(filter);
  
  this.dataSource.filter = newDate!.toString().trim();
  
  const selectedDate = this.datePipe.transform(this.date, 'MMM dd, yyyy');
  
  if (selectedDate) {
    this.selectedDateString = selectedDate;
  }
}

clearFilter() {
  this.dataSource.filter = '';
  this.selectedStatusName = '';
  this.selectedDateString = '';
  
  this.getAllFeedbacksByUniqueEmail();
  
  this.apiData.clearFilter();
  this.apiData.clearForm();
}

isFilterActive(): boolean {
  return this.dataSource.filter.trim() !== '';
}

  addBroadcast() {
      sessionStorage.setItem('currentPage_1', `${this.currentPage}`);
      sessionStorage.setItem('pageSize_1', `${this.pageSize}`);

      const data = this.selection.selected;
      this.apiData.setFeedbackData(data);

      this.getAllBroadcastMessages();

      this.router.navigate(["/admin/feedback/broadcast/addBroadcast"]);
    }

    viewBroadcast() {
      sessionStorage.setItem('currentPage_1', `${this.currentPage}`);
      sessionStorage.setItem('pageSize_1', `${this.pageSize}`);
  
      const data = this.selection.selected; 
      this.apiData.setFeedbackData(data);
  
      this.getAllBroadcastMessages();
  
      this.router.navigate(["/admin/feedback/broadcast/listBroadcasts"]);
    }

    getAllBroadcastMessages() {
      this.apiAdmin.getBroadcastMessages().subscribe(
        (data: any) => {
          this.apiData.setBroadcastData(data);
        },
        (error) => {
          console.error("Error soft deleting feeback:", error);
        }
        );
    }
  }