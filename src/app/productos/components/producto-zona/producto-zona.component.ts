import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Producto } from '../../interfaces/productos.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-producto-zona',
  templateUrl: './producto-zona.component.html',
  styleUrls: ['./producto-zona.component.css']
})
export class ProductoZonaComponent implements OnInit {

  @Input() producto!: Producto;

  @Input() esproductor: boolean = false;

  @Input() ebusqueda: boolean = false;

  productos: Producto[] = [];


  cantidad_producto: number = 0 ;

  usuario: Usuario = {
    id: '',
    nombre: '',
    nombre_empresa: '',
    ubicacion: '',
    coord_x: '',
    coord_y: '',
    foto: ' ',
    zona: 0,
    id_usuario: 0
  }

  constructor(private pedidoService:PedidosService,
              private infoUsuarioService: InfoUsuarioService,
              private snackBar: MatSnackBar){}

  
  ngOnInit(): void {
    this.pedidoService.cart.find(item => item.id_producto == this.producto.id);
    const elemento: ItemCarrito = this.buscar()!;
    
    const item: number = this.pedidoService.cart.indexOf(this.buscar()!);

    if(item != -1){
      this.cantidad_producto = elemento.cantidad;
    }

    this.infoUsuarioService.getInfoUsuario(this.producto.id_usuario)
    .subscribe((usuario: Usuario) => this.usuario = usuario);



  }

  buscar(){
    return this.pedidoService.cart.find(item => item.id_producto == this.producto.id);
  }

  

}
