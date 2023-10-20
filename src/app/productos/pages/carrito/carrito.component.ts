import { isNgTemplate } from '@angular/compiler';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { slideInAnimation } from 'animation';
import { switchMap } from 'rxjs/operators';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { SharedService } from 'src/app/services/shared.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
  animations: [
    slideInAnimation
  ]
})
export class CarritoComponent implements OnInit,AfterViewInit {

  cart : ItemCarrito[] = JSON.parse(localStorage.getItem("cart")!) || [];

  carrito_tipo_venta : ItemCarrito[] = [];

  tipo_venta : number = 0;

  transporte_n: number = 0;
  unificar_n: number = 0;
  recogida_n: number = 0;
  frio_n: number = 0;

  total: number = 0;
  
  constructor(private pedidoService:PedidosService,
              private productoService: ProductosService,
              private router: Router,
              private sharedService: SharedService) { }

  ngAfterViewInit(): void {
    this.comprobar_disponibilidad();  
  }

  ngOnInit(): void {
    this.total = this.pedidoService.calcularPrecioTotal();
    this.comprobar_disponibilidad();


    this.cargar_carro()
   



  }

  cargar_carro(){


    this.transporte_n = 0;
    this.unificar_n = 0;
    this.recogida_n = 0;
    this.frio_n = 0;

    for(let item of this.cart){
      if(item.recogida == 'envio'){
        this.transporte_n++;
      }
      else if(item.recogida == 'unificado'){
        this.unificar_n++;
      }
      else if(item.recogida == 'recogida'){
        this.recogida_n++;
      }
      else if(item.recogida == 'frio'){
        this.frio_n++;
      }
    }


    if(this.transporte_n > 0){
      this.cargar_venta(0);
    }
    else if(this.unificar_n > 0){
      this.cargar_venta(1);
    }
    else if(this.recogida_n > 0){
      this.cargar_venta(2);
    }
    /*else if(this.frio_n > 0){
      this.cargar_venta(3);
    }*/

  }

comprobar_disponibilidad(){
    for(let item of this.pedidoService.cart){
        
      this.productoService.getProductoPorId(item.id_producto)
      .subscribe( producto => {
        
        console.log(producto)
            if(producto !== null){
              const i = this.pedidoService.cart.indexOf(this.pedidoService.cart.find(item => item.id_producto == producto.id)!)
      
              if(producto.stock <= 0){
                console.log("Hello")
                this.pedidoService.cart[i].estado = "No Stock"
              }
              else{ 
                
              }
            }else{
              item.estado = "No Disponible"
            }

            localStorage.removeItem("cart");
          localStorage.setItem("cart",JSON.stringify(this.pedidoService.cart))
          console.log("actualizado")
          })

          

    }

  }


  delete(itemcarrito: ItemCarrito){

    const item: number = this.cart.indexOf(itemcarrito);

    if(item != -1){
      this.pedidoService.cart.splice(item,1)

      localStorage.setItem("cart",JSON.stringify(this.pedidoService.cart));

      this.cart = this.pedidoService.cart;

      this.cambiar_total();

      this.cargar_carro();
      
    }

  }

  cambiar_total(){

    this.cart = JSON.parse(localStorage.getItem("cart")!) || [];
    
    this.cargar_venta(this.tipo_venta);
    
  }


  get_peso_producto(item : ItemCarrito) : ItemCarrito{

    this.productoService.getProductoPorId(item.id_producto)
      .subscribe(producto => {
        item.peso_producto = producto.peso_total;
        item.cantidad_producto = producto.cantidad;

        return item;
      })

    return item;
  }

  cargar_venta(tipo : number){
    this.tipo_venta = tipo;
    this.sharedService.Settipo_venta = this.tipo_venta;

    this.carrito_tipo_venta = [];
    this.total = 0;

    if(this.tipo_venta == 0){ //TRANSPORTE

      let cart : ItemCarrito[];

      for(let item of this.cart){
        if(item.recogida == 'envio' || item.recogida == 'frio'){
          item = this.get_peso_producto(item);

          this.carrito_tipo_venta.push(item);
        }
      }


    }else if(this.tipo_venta == 1){ //UNIFICADO

      let cart : ItemCarrito[];

      for(let item of this.cart){
        if(item.recogida == 'unificado'){

          item = this.get_peso_producto(item);

          this.carrito_tipo_venta.push(item);
        }
      }


    }else if(this.tipo_venta == 2){ //RECOGIDA

      let cart : ItemCarrito[];

      for(let item of this.cart){
        if(item.recogida == 'recogida'){

          item = this.get_peso_producto(item);
          
          this.carrito_tipo_venta.push(item);
        }
      }


    }/*else if(this.tipo_venta == 3){ //FRIO

      let cart : ItemCarrito[];

      for(let item of this.cart){
        if(item.recogida == 'frio'){
          this.carrito_tipo_venta.push(item);
        }
      }


    }*/


    for(let item of this.carrito_tipo_venta){
      this.total += (item.precio * item.cantidad);
    }

  }


  continuar_compra(){
    this.sharedService.Setcarro_compra = this.carrito_tipo_venta;

    console.log(" carro ")
    console.log(this.sharedService.Getcarro_compra)




    this.router.navigateByUrl('productos/info-pedido')
  }


}
