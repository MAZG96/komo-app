import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { Pedido } from '../../interfaces/pedidos.interface';
import { Producto } from '../../interfaces/productos.interface';

@Component({
  selector: 'app-pedidos-lista',
  templateUrl: './pedidos-lista.component.html',
  styleUrls: ['./pedidos-lista.component.css']
})
export class PedidosListaComponent implements OnInit,AfterViewInit {

  @Input() pedidos!: Pedido[];
  pages: number = 1;

  
  constructor(private sharedService:SharedService,
    private router: Router) { }
    
  ngAfterViewInit(): void {
    this.pages = this.sharedService.Getpage_back;
    this.sharedService.Setpage_back = 1;
  }

  ngOnInit(): void {
    
  }

  ir_pedido(id:number){
    this.sharedService.SetproductoId = id;
    this.sharedService.Setpage_back = this.pages;
    this.router.navigate(['/productos/pedidos/'+id]);
      
  }

}
