import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Producto } from '../../interfaces/productos.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-boton-carro',
  templateUrl: './boton-carro.component.html',
  styleUrls: ['./boton-carro.component.css']
})
export class BotonCarroComponent implements OnInit {

  producto!: Producto;

  @Input() id_producto!: string;

  @Input() esCarrito!: boolean;

  @Input() esProducto!: boolean;

  productos: Producto[] = [];

  usuario!: Usuario;

  item_carrito: ItemCarrito = {
    id: 0,
    id_producto: '',
    id_productor: 0,
    foto: '',
    cantidad: 0,
    precio: 0,
    nombre: '',
    recogida: 'envio',
    pago_recogida: 0
  }

  cantidad_producto: number = 0 ;

  
  constructor(private pedidoService:PedidosService,
              private productoService: ProductosService,
              private infoUsuarioService: InfoUsuarioService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.pedidoService.cart.find(item => item.id_producto == this.id_producto);
    const elemento: ItemCarrito = this.buscar()!;
    
    const item: number = this.pedidoService.cart.indexOf(this.buscar()!);

    if(item != -1){
      this.cantidad_producto = elemento.cantidad;
    }

    this.productoService.getProductoPorId(this.id_producto).pipe(
      switchMap(producto => {
        this.producto = producto
        if(producto){
          const elemento: ItemCarrito = this.buscar()!;
        if(this.producto.stock == 0 && elemento){
          elemento.cantidad =0;
          this.cantidad_producto= 0;
        }
        
        }

        return this.infoUsuarioService.getInfoUsuario(producto.id_usuario).pipe()
    })
    ).subscribe(usuario => {
      this.usuario = usuario;
    }

    )

    this.productoService.getProductoPorId(this.id_producto)
    .subscribe(producto => {
      this.producto = producto
      if(producto){
        const elemento: ItemCarrito = this.buscar()!;
      if(this.producto.stock == 0 && elemento){
        elemento.cantidad =0;
        this.cantidad_producto= 0;
      }
      }
    })
    
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

  buscar(){
    return this.pedidoService.cart.find(item => item.id_producto == this.id_producto);
  }

  add(){
    if(this.usuario.envio_individual == 1){ // TRANSPORTE

      this.item_carrito ={
        id: 0,
        id_producto: this.id_producto,
        foto: this.producto.foto,
        id_productor: this.producto.id_usuario,
        cantidad: 1,
        precio: this.producto.precio,
        nombre: this.producto.nombre,
        recogida: 'envio',
        pago_recogida: 0
      }

    }else if(this.usuario.zona != 0){

      this.item_carrito ={
        id: 0,
        id_producto: this.id_producto,
        foto: this.producto.foto,
        id_productor: this.producto.id_usuario,
        cantidad: 1,
        precio: this.producto.precio,
        nombre: this.producto.nombre,
        recogida: "unificado",
        pago_recogida: this.usuario.pago_recogida
      }

    }else if(this.usuario.recogida == 1){ //RECOGIDA

      this.item_carrito ={
        id: 0,
        id_producto: this.id_producto,
        foto: this.producto.foto,
        id_productor: this.producto.id_usuario,
        cantidad: 1,
        precio: this.producto.precio,
        nombre: this.producto.nombre,
        recogida: "recogida",
        pago_recogida: this.usuario.pago_recogida
      }

    }else if(this.usuario.envio_frio == 1){ //FRIO

      this.item_carrito ={
        id: 0,
        id_producto: this.id_producto,
        foto: this.producto.foto,
        id_productor: this.producto.id_usuario,
        cantidad: 1,
        precio: this.producto.precio,
        nombre: this.producto.nombre,
        recogida: "frio",
        pago_recogida: this.usuario.pago_recogida
      }

    }
    
    
    /* 
      IMPLEMENTAR LA BÚSQUEDA DEL ELEMENTO PARA AUMENTAR LA CANTIDAD 
      Y NO CREAR OTRO ITEM DEL CARRITO
    */

    if (this.pedidoService.cart.indexOf(this.buscar()!) != -1 && this.cantidad_producto < this.producto.stock    ){
      
      const item: number = this.pedidoService.cart.indexOf(this.buscar()!);

      const elemento: ItemCarrito = this.buscar()!;

      this.pedidoService.cart[item] = {
        id: elemento.id,
        id_producto: elemento.id_producto,
        id_productor: elemento.id_productor,
        foto: elemento.foto,
        cantidad: elemento.cantidad+1,
        precio: elemento.precio,
        nombre: elemento.nombre,
        recogida: elemento.recogida,
        pago_recogida: elemento.pago_recogida
      }

      this.cantidad_producto++

      localStorage.setItem("cart",JSON.stringify(this.pedidoService.cart))



    }else if(this.cantidad_producto < this.producto.stock){

      this.pedidoService.cart.push(this.item_carrito);
      

      localStorage.setItem("cart",JSON.stringify(this.pedidoService.cart))
      this.cantidad_producto++

      

    }else{
      this.snackBar.open( "No hay mas stock disponible", 'ok!', {
        duration: 2500
      });
    }

    this.pedidoService.calcularPrecioTotal();

     
  }

  remove(){
    this.item_carrito ={
      id: 0,
      id_producto: this.id_producto,
      id_productor: this.producto.id_usuario,
      foto: this.producto.foto,
      cantidad: 1,
      precio: this.producto.precio,
      nombre: this.producto.nombre,
      recogida: 'envio',
    }
    

    if (this.cantidad_producto > 0   ){
      const item: number = this.pedidoService.cart.indexOf(this.buscar()!);
      

      const elemento: ItemCarrito = this.buscar()!;



      if(elemento.cantidad != 1){

        this.pedidoService.cart[item] = {
          id: elemento.id,
          id_producto: elemento.id_producto,
          id_productor: elemento.id_productor,
          foto: elemento.foto,
          cantidad: elemento.cantidad-1,
          precio: elemento.precio,
          nombre: elemento.nombre,
          recogida: elemento.recogida,
          pago_recogida: elemento.pago_recogida
        }
        
      }else{
        this.pedidoService.cart.splice(item,1)
      }
      
      this.cantidad_producto--;

      localStorage.setItem("cart",JSON.stringify(this.pedidoService.cart));
    }
    //Borrar producto del carrito en el local storage

    this.pedidoService.calcularPrecioTotal();
    
  }

  }


