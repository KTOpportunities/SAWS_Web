import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
  })
export class loginComponent implements OnInit {
    constructor(private router: Router){}
    ngOnInit(): void {
       debugger 
    }

    forgotPassword(){
        this.router.navigate(['forgot-password']);
    }
}