import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { Producto } from '../../interfaces/productos.interface';

@Component({
  selector: 'app-producto-lista',
  templateUrl: './producto-lista.component.html',
  styles: [`
  img{
    object-fit: cover; /* no poner tamaño del width para que sea responsive*/
    width: 60px;

    height: 40px;
  }
  mat-list-option{
    margin-bottom:10px;
  }
  `]
})
export class ProductoListaComponent implements OnInit {

  @Input() productos!: Producto[];
  
  constructor(private sharedService:SharedService,
    private router: Router) { }

  ngOnInit(): void {
  }

  ir_producto(id:number){
    this.sharedService.SetproductoId = id;
    
    this.router.navigate(['/productos/editar/']);
      
  }

}
