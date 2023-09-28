import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ZonaService } from 'src/app/backoffice/services/zona.service';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Categoria } from '../../interfaces/categoria.interfaces';
import { Producto } from '../../interfaces/productos.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { Zona } from '../../interfaces/zona.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { ModificarCarritoComponent } from '../modificar-carrito/modificar-carrito.component';
import { TextoCarritoRecogidaComponent } from '../texto-carrito-recogida/texto-carrito-recogida.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-lista-unificado',
  templateUrl: './lista-unificado.component.html',
  styleUrls: ['./lista-unificado.component.css']
})
export class ListaUnificadoComponent implements AfterViewInit {

   
  @Output() newItemEvent = new EventEmitter<number>();

  addNewItem(value: number) {
    this.newItemEvent.emit(value);
  }

  get_output(value:number){
    this.newItemEvent.emit(value);
  }

  cart!: ItemCarrito[];

  carro_ordenado!: ItemCarrito[];

  recogida: boolean = false;
  envio: boolean = false;
  busqueda_zonas: boolean = false;


  start: number = 0;
  end: number = 6;



  termino: string  = '';
  productos: Producto[] = [];
  usuarios: Usuario[] = [];
  todos_productos: Producto[] = [];
  todos_usuarios: Usuario[] = [];
  categorias!: Categoria[];


  cargado: boolean = false;


  productoSeleccionado: Producto | undefined;

  direc:string = "Ubicacion";
  busqueda_vacia:boolean = false;

  zonas!: Zona[];
  
  @Input() carrito_zona!: ItemCarrito[];


  indices: number[] = [];
  indices_copia: number[] = [];



  total: number = 0;

  zona!:Zona;


  
  constructor(private pedidoService:PedidosService,
              private productosService: ProductosService,
              private zonaService: ZonaService,
              public dialog: MatDialog,
              private sharedService: SharedService,
              private infoUsuarioService: InfoUsuarioService,
              private router:Router) { }


  ngAfterViewInit() {

    //ORDENAR EL CARRITO POR Vendedores
    this.ordenar_carro();

  }


  ordenar_carro(){

    this.total = this.pedidoService.calcularPrecioTotal();
    this.cart = this.sharedService.Getcarro_compra;

    this.infoUsuarioService.getInfoUsuarios()
    .subscribe(usuarios => {
      for(let usuario of usuarios){
        for(let item of this.cart){
          if(item.id_productor == usuario.id_usuario){
            if(item.recogida == "unificado"){
              item.zona = usuario.zona;
            }else{
              item.zona = 0;
            }
          }
        }
      }

      this.pedidoService.cart = this.cart;
      this.carrito_zona = this.cart;
      console.log(this.carrito_zona)

      if(this.cart.length == 0){
        this.router.navigate(['/productos/listado'])
      }else{
      
        this.cargado = true;
      
        this.zonas = [];
        
        for(let item of this.carrito_zona){
          if(item.zona != 0){
            this.indices_copia.push(item.zona!);
          }
        }
      
        this.indices = this.indices_copia.filter((item,index)=>{
          return this.indices_copia.indexOf(item) === index;
        })

        

        this.carro_ordenado = this.groupBy<ItemCarrito>(this.carrito_zona,"zona");

        this.addNewItem(this.carro_ordenado.length)
      }
    })


  }

 


  groupBy<ItemCarrito>(collection:ItemCarrito[],key: keyof ItemCarrito){

    localStorage.removeItem("cart_zona");

    
    const groupedResult =  collection.reduce((previous,current)=>{
 
    if(!previous[current[key]]){
      previous[current[key]] = [] as ItemCarrito[];
     }
 
    previous[current[key]].push(current);
           return previous;
    },{} as any); // tried to figure this out, help!!!!!
      return groupedResult
  }

  get_zona(id: number){

    this.zonaService.getZona(id)
    .subscribe(zona => {
      if(zona){

        this.zona = zona;
        localStorage.setItem("zona",JSON.stringify(zona));

      }
    })

    if(localStorage.getItem("zona")){
      let zona = JSON.parse(localStorage.getItem("zona")!);

      return zona.provincia;
    }else{
      return "";
    }


  }
  

  cambiar_total(){
      this.total = 0;
      let comision = 0.03; //13% en caso de recogida
  
      for (let item of this.carro_ordenado){
  
        this.productosService.getProductoPorId(item.id_producto)
          .subscribe(producto => {
              item.precio = producto.precio;
          })
        
        if((item.estado != "No Disponible" && item.estado != "No Stock") && item.pago_recogida == 0 && item.recogida == "envio" ){
          this.total = this.total + (item.precio * item.cantidad);
        }
        if((item.estado != "No Disponible" && item.estado != "No Stock") && item.pago_recogida == 0 && item.recogida != "envio" ){ //COMISION
  
          let precio_recogida = (item.precio * item.cantidad) + (item.precio * item.cantidad * comision)
          this.total = this.total + precio_recogida;
        }
        if((item.estado != "No Disponible" && item.estado != "No Stock") && item.pago_recogida == 1 && item.recogida != "envio" ){ //COMISION
  
          let precio_recogida = (item.precio * item.cantidad * comision)
          this.total = this.total + precio_recogida;
        }
      }
      return this.total;
  }

  DialogModificarCarrito(item: ItemCarrito): void {
    const dialogRef = this.dialog.open(ModificarCarritoComponent, {
      maxHeight: 'calc(100%)',
      maxWidth: 'calc(100vw - 10px)',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ordenar_carro();
      
    });
  }

  

}
