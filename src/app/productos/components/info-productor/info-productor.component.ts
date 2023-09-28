import { Component, Input, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Producto } from '../../interfaces/productos.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { InfoUsuarioService } from '../../services/info-usuario.service';

@Component({
  selector: 'app-info-productor',
  templateUrl: './info-productor.component.html',
  styleUrls: ['./info-productor.component.css']
})
export class InfoProductorComponent implements OnInit {

  @Input() infoUser!: Usuario;

  info!: Usuario;

  item_pedidos!: ItemCarrito[];

  numero_ventas: number = 0;

  numero_pedidos!: number;

  centro_mapa: [number,number] = [0,0];

  productos_en_venta: number = 0;


  constructor(private productoService: ProductosService,
              private infoUsuarioService: InfoUsuarioService,
              private pedidoService: PedidosService) { }

  ngOnInit(): void {

    this.pedidoService.getPedidosPorUsuario(Number(this.infoUser.id_usuario)).subscribe(
     pedidos => {
        this.centro_mapa = [Number(this.infoUser.coord_x),Number(this.infoUser.coord_y)];

        this.numero_pedidos = pedidos.length;
     })


     this.infoUsuarioService.getInfoUsuario(Number(this.infoUser.id))
      .subscribe(info => this.info= info)
      
     this.pedidoService.getItemPedidosVendidos(this.infoUser.id_usuario)
      .subscribe(item_pedidos => this.numero_ventas = item_pedidos.length)
     
        

     this.productoService.getProductoPorUsuario(this.infoUser.id_usuario)
         .subscribe(productos => {
                this.productos_en_venta = productos.length;
      })
  }



}



