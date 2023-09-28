import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-elige-perfi',
  templateUrl: './elige-perfi.component.html',
  styleUrls: ['./elige-perfi.component.css']
})
export class EligePerfiComponent implements OnInit {



  constructor(private authService: AuthService,
    public router :Router) { }

  get usuario() {
    return this.authService.auth;
  }

  ngOnInit(): void {
    if(!this.usuario){
      this.router.navigate(['./']);

    }
  }


  ir_productor(){
    this.router.navigate(['./perfil-productor']);
  }

  ir_pedidos(){
    this.router.navigate(['./']);
  }

}
