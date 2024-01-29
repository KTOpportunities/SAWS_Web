import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoggedIn } from 'src/app/Models/user.model';
import { Dataservice } from 'src/app/services/data.service';
import { TokeStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {

  date: Date;
  userLoginDetails: UserLoggedIn[] = [];
  userName: any;
  userRole: any;

  constructor(
    private apiData: Dataservice,
    private router: Router,
    public datePipe: DatePipe
  ){
    this.date = new Date();
  }

  ngOnInit(): void {

    var user: any = this.apiData.getCurrentUser();
    
    if(user){
      const userLoginDetails =  JSON.parse(user);
      this.userName = userLoginDetails?.aspUserName;
      this.userRole = userLoginDetails?.rolesList;
    } else {
      this.router.navigate(['/login']);
    }    
  }
}