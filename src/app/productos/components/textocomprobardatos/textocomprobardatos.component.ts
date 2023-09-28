import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-textocomprobardatos',
  templateUrl: './textocomprobardatos.component.html',
  styleUrls: ['./textocomprobardatos.component.css']
})
export class TextocomprobardatosComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  ir_perfil_productor(){
      this.router.navigate(['./perfil-productor']);
  }

}
