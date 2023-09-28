import { ViewportScroller } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Feature } from '@turf/turf';
import { finalize, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModificarCarritoComponent } from '../../components/modificar-carrito/modificar-carrito.component';
import { TextoCarritoRecogidaComponent } from '../../components/texto-carrito-recogida/texto-carrito-recogida.component';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Categoria } from '../../interfaces/categoria.interfaces';
import { Pedido } from '../../interfaces/pedidos.interface';
import { Producto } from '../../interfaces/productos.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { ModificarInfoPedidoComponent } from '../modificar-info-pedido/modificar-info-pedido.component';

@Component({
  selector: 'app-datos-pedido',
  templateUrl: './datos-pedido.component.html',
  styleUrls: ['./datos-pedido.component.css']
})
export class DatosPedidoComponent implements OnInit {

  
  totales: number[] = [];
  total_unificado: number = 0;
  total_recogida: number = 0;
  total_frio: number = 0;

  cart!: ItemCarrito[];

  carro_ordenado!: ItemCarrito[];

  recogida: boolean = false;
  unificado: boolean = false;
  frio: boolean = false;


  cargando_pago = true;


  start: number = 0;
  end: number = 6;


  pedido!: Pedido;



  termino: string  = '';
  productos: Producto[] = [];
  usuarios: Usuario[] = [];
  todos_productos: Producto[] = [];
  todos_usuarios: Usuario[] = [];
  categorias!: Categoria[];


  cargado: boolean = false;


  productoSeleccionado: Producto | undefined;

  lugar_elegido?: Feature;
  direc:string = "Ubicacion";
  productos_copia!: Producto[];
  categoria_elegida?: Categoria;
  busqueda_vacia:boolean = false;
  resultado_productos_distancia: Producto[] = [];
  
  carrito_zona!: ItemCarrito[];


  indices: number[] = [];
  indices_copia: number[] = [];



  total: number = 0;

  id_pedido: number = 0;


  @Output() newItemEvent = new EventEmitter<number>();



  
  constructor(private pedidoService:PedidosService,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private sharedService: SharedService,
              private infoUsuarioService: InfoUsuarioService,
              private router:Router) { }

  ngOnInit() {

    if(!this.sharedService.Getcarro_compra){
      this.router.navigateByUrl("/productos/listado");
    }

    this.total = this.pedidoService.calcularPrecioTotal();
    this.cart = this.sharedService.Getcarro_compra
    this.pedidoService.cart = JSON.parse(localStorage.getItem("cart")!) || [];
    this.pedido = JSON.parse(localStorage.getItem("info-pedido")!);
    this.pedido.tipo_venta = this.sharedService.Gettipo_venta;


    

    this.recogida = this.todos_recogidas();

    if(this.pedido === null || this.cart.length == 0){
      this.router.navigateByUrl("/productos/listado");
    }


    this.infoUsuarioService.getInfoUsuarios()
      .subscribe(usuarios => {
        for(let usuario of usuarios){
          for(let item of this.sharedService.Getcarro_compra){
            if(item.id_productor == usuario.id_usuario){
              item.zona = usuario.zona;
            }
          }
        }
        this.carrito_zona = this.sharedService.Getcarro_compra;

        console.log(this.cart)
        console.log(this.sharedService.Getcarro_compra)
      })

  }

  todos_recogidas(){
    this.cart = JSON.parse(localStorage.getItem("cart")!) || [];

    for(let item of this.cart){
      if(item.recogida == 'envio'){
        return false;
      }
    }

    return true;
  }
  
  get_total_unificado(value:number){

    console.log(value)
    if(value !== undefined){
      this.total_unificado += value
    }else{
      this.total_unificado = 0;
    }

  }



  get_total_recogida(value:number){
    this.total_recogida = value;
  }
  get_total_frio(value:number){
    this.total_frio = value;
  }

  async cargar_carro(){
    
  }

  toUnificado(){
    this.unificado = true;
    this.recogida = false;
    this.frio = false;
    this.router.navigate(['/productos/datos-pedido'], { fragment: 'uni' });
  }

  

  toRecogida(){
    this.unificado = false;
    this.recogida = true;
    this.frio = false;
    this.router.navigate(['/productos/datos-pedido'], { fragment: 'rec' });
  }

  toFrio(){
    this.unificado = false;
    this.recogida = false;
    this.frio = true;
  }

  hay_recogida(): boolean{
    for(let item of this.cart){
      if(item.recogida == 'recogida'){
        return true;
      }
    }

    return false;
  }

  hay_fechas_sinelegir(): boolean{



    this.cart = this.sharedService.Getcarro_compra;


    console.log(this.cart)


    for(let item of this.cart){
      if(item.recogida == 'recogida'){
        return true;
      }
    }
    return false;
  }


  mostrarSnakbar( mensaje: string ) {

    this.snackBar.open( mensaje, 'ok!', {
      duration: 2500
    });

  }

  llamar_pago(){

    

    if(this.hay_fechas_sinelegir()){

      this.mostrarSnakbar("Elige el día de recogida de todos los productos")

    }
    else{

    this.cargando_pago = false;
    
    this.pedido.total = Number((this.total_unificado + this.total_recogida + this.total_frio).toFixed(2));

    this.pedidoService.agregarPedido(this.pedido).pipe(
      switchMap(pedido => {

        for (var _i = 0; _i < this.sharedService.Getcarro_compra.length; _i++){
          this.sharedService.Getcarro_compra[_i] = {
            id: this.sharedService.Getcarro_compra[_i].id,
            id_producto: this.sharedService.Getcarro_compra[_i].id_producto,
            foto: this.sharedService.Getcarro_compra[_i].foto,
            nombre: this.sharedService.Getcarro_compra[_i].nombre,
            cantidad: this.sharedService.Getcarro_compra[_i].cantidad,
            precio: this.sharedService.Getcarro_compra[_i].precio,
            id_productor: this.sharedService.Getcarro_compra[_i].id_productor,
            recogida: this.sharedService.Getcarro_compra[_i].recogida,
            id_ups: ""+this.sharedService.Getcarro_compra[_i].zona,
            pago_recogida: this.sharedService.Getcarro_compra[_i].pago_recogida,
            id_pedido: pedido.id
          }
          this.sharedService.SetproductoId = Number(pedido.id);

          let cart = JSON.parse(localStorage.getItem("cart")!);
            
          for(let item of cart){
            for(let y of this.sharedService.Getcarro_compra){

              if(item.id_producto == y.id_producto){
                console.log(item)

                let index = cart.indexOf(item);

                console.log(index);

                cart.splice(index,1);
              }
            }

          }

          localStorage.setItem("cart",JSON.stringify(cart))
          
        }
        

        return this.pedidoService.agregarItemPedido( this.sharedService.Getcarro_compra).pipe(finalize(()=> {
          if(this.sharedService.Getcarro_compra[0].id_pedido != 0){

            let date = new Date(pedido.updatedAt!); // some mock date
            let milliseconds = date.getTime(); 

            let id_crypt = pedido.id;


            this.id_pedido = pedido.id;



            localStorage.removeItem("info-pedido");

            window.location.href = "/productos/checkout/"+milliseconds+"komo"+id_crypt;
          }else{
            console.log("ALGO VA MAL")
          }
        }))
      }))
        .subscribe(async msg => {
          
          
        })
      }

  }

  ir_pago(){

    this.pedidoService.getPedidoPorId(this.id_pedido)
      .subscribe(pedido => {

        let date = new Date(pedido.updatedAt!); // some mock date
        let milliseconds = date.getTime(); 

        let id_crypt = pedido.id;


        this.id_pedido = pedido.id;


        window.location.href = "/productos/checkout/"+milliseconds+"komo"+id_crypt;

      })

  }

  pasar_pago(id_crypt: any){
    window.location.href = "/productos/checkout/"+id_crypt;
  }


  DialogModificarrInfoPedido(): void {
    const dialogRef = this.dialog.open(ModificarInfoPedidoComponent, {
      maxHeight: 'calc(100%)',
      maxWidth: 'calc(100vw - 10px)',
    });

    dialogRef.afterClosed().subscribe(result => {
      
      this.pedido = JSON.parse(localStorage.getItem("info-pedido")!);
      
    });
  }

  borrar_productos_recogida(){
    this.cart = JSON.parse(localStorage.getItem("cart")!) || [];

    let copia_carrito = JSON.parse(localStorage.getItem("cart")!) || [];


    for(let item of copia_carrito){
      console.log(item)

      if(item.recogida == '1' || item.recogida != 'envio'){

        let indice = this.cart.indexOf(item);
        this.cart.splice(indice,1);

      }
    }


    this.pedidoService.cart = this.cart;
    localStorage.setItem("cart",JSON.stringify(this.cart))
    this.mostrarSnakbar("Los productos con opción a recogida, han sido eliminados de la cesta. Pulse Continuar para seguir con la compra");
  }

  DialogDatos(): void {
    const dialogRef = this.dialog.open(TextoCarritoRecogidaComponent, {
      width: '250px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result.event == 'elegir'){
        this.recogida = true;
      }
      
      
    });
  }
}
