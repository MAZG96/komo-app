import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Producto } from '../../interfaces/productos.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';



@Component({
  selector: 'app-producto-tarjeta',
  templateUrl: './producto-tarjeta.component.html',
  styleUrls: ['./producto-tarjeta.component.css']
})

export class ProductoTarjetaComponent implements OnInit{

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
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private sharedService: SharedService,
              private router: Router){}


  get usuario_logueado() {
    return this.authService.auth;
  }

  
  ngOnInit(): void {

    this.producto.nombre = this.producto.nombre.toLocaleLowerCase();
    
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


  ir_productor(){
    this.sharedService.SetproductoId = this.producto.id_usuario;

    console.log(this.sharedService.GetproductoId);

    this.router.navigate(['/productos/productor']);
    
  }

  ir_producto(){
    this.sharedService.SetproductoId = Number(this.producto.id);

    console.log(this.sharedService.GetproductoId);

    this.router.navigate(['/productos/producto']);
    
  }

  comprobar_dia_venta(usuario: Usuario): boolean{
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const d = new Date();
    let day = weekday[d.getDay()];

    let dias_publicados = usuario.dias_publicados?.split(',')

    if(dias_publicados?.includes(day)){
      return true;
    }else{

      return false;
    }
  }

  

 

}
