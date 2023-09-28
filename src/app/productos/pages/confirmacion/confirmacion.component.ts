import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.css']
})
export class ConfirmacionComponent implements OnInit {

  pedido: boolean = true;

  constructor(private activatedRoute: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap( ({ token }) => this.authService.activar(token))
    ).subscribe(resp =>
      {
        console.log(resp.ok);
           
      });
  }

  }

