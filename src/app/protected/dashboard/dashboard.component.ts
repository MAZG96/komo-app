import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [`
    *{
      margin: 10px;
    }
  `
  ]
})
export class DashboardComponent {

  get usuario() {
    return this.authService.auth;
  }

  constructor(private router: Router,
              private authService: AuthService) { }

  logout(){

    this.router.navigateByUrl('/auth');
    this.authService.logout();
  }

}
