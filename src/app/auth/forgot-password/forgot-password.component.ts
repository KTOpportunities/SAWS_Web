import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css'],
  })

  export class forgotPasswordComponent implements OnInit{


    constructor(private router:Router,
      ){
      }

    ngOnInit(): void {
        
    }

  
    
    Resetpassword(){
        this.router.navigate(['reset-password']);
    }
  }