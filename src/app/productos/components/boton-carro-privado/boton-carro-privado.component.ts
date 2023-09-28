import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Producto } from '../../interfaces/productos.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-boton-carro-privado',
  templateUrl: './boton-carro-privado.component.html',
  styleUrls: ['./boton-carro-privado.component.css']
})
export class BotonCarroPrivadoComponent implements OnInit {

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
              private sharedService: SharedService,
              private productoService: ProductosService,
              private infoUsuarioService: InfoUsuarioService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.sharedService.Getcarro_compra.find(item => item.id_producto == this.id_producto);
    const elemento: ItemCarrito = this.buscar()!;
    
    const item: number = this.sharedService.Getcarro_compra.indexOf(this.buscar()!);

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

  buscar(){
    return this.sharedService.Getcarro_compra.find(item => item.id_producto == this.id_producto);
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

    if (this.sharedService.Getcarro_compra.indexOf(this.buscar()!) != -1 && this.cantidad_producto < this.producto.stock    ){
      
      const item: number = this.sharedService.Getcarro_compra.indexOf(this.buscar()!);

      const elemento: ItemCarrito = this.buscar()!;

      this.sharedService.Getcarro_compra[item] = {
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




    }else if(this.cantidad_producto < this.producto.stock){

      this.sharedService.Getcarro_compra.push(this.item_carrito);
      
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
      const item: number = this.sharedService.Getcarro_compra.indexOf(this.buscar()!);
      

      const elemento: ItemCarrito = this.buscar()!;



      if(elemento.cantidad != 1){

        this.sharedService.Getcarro_compra[item] = {
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

        this.sharedService.Getcarro_compra.splice(item,1)

        this.pedidoService.cart.splice(item,1)
      }
      
      this.cantidad_producto--;

      localStorage.setItem("cart",JSON.stringify(this.pedidoService.cart));
    }
    //Borrar producto del carrito en el local storage

    this.pedidoService.calcularPrecioTotal();
    
  }

  }


