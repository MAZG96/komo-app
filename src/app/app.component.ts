import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { slideInAnimation } from 'animation';
import { NotificacionService } from './productos/services/notificacion.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
  ]
})
export class AppComponent {
  title = 'KOMO';




  constructor(private router: Router,
    private notificacionService: NotificacionService,
    private swPush: SwPush) {
      
    }


  

  ngOnInit() { 
  }
}
