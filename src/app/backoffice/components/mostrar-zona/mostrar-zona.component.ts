import { Component, Input, OnInit } from '@angular/core';
import { ZonaService } from '../../services/zona.service';
import { Zona } from 'src/app/productos/interfaces/zona.interface';
import { ItemCarrito } from 'src/app/productos/interfaces/carrito.interface';
import { ProductosService } from 'src/app/productos/services/productos.service';
import { PedidosService } from 'src/app/productos/services/pedidos.service';

@Component({
  selector: 'app-mostrar-zona',
  templateUrl: './mostrar-zona.component.html',
  styleUrls: ['./mostrar-zona.component.css']
})
export class MostrarZonaComponent implements OnInit {

  constructor(private zonaService:ZonaService,
              private pedidoService: PedidosService,
              private productoService: ProductosService) { }

  @Input() id_zona!: number;

  @Input() item_pedidos!: ItemCarrito[];


  peso_total: number = 0.0;

  precio_comision!: number;

  precio_envio: number =0.0;


  zona!: Zona;

  ngOnInit(): void {



    this.zonaService.getZona(this.id_zona)
      .subscribe(zona => this.zona = zona)

    this.productoService.getProductos()
      .subscribe(productos => {
        for(let o of productos){
          for(let item of this.item_pedidos){

            if(o.id == item.id_producto){
              console.log(o.peso_total)
              this.peso_total += o.peso_total;
            }

          }
        }

        this.precio_envio = this.pedidoService.calcular_precio_envio(this.peso_total);

      })

  }


  calcular_comision(): number{

    this.precio_comision= 0.0;

    for(let item of this.item_pedidos){


        this.precio_comision += (item.precio*item.cantidad)

    }

    this.precio_comision = this.precio_comision * 0.03;


    return this.precio_comision;
  }

}
