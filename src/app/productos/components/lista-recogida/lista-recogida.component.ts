import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
import { TextoPopComponent } from '../texto-pop/texto-pop.component';

@Component({
  selector: 'app-lista-recogida',
  templateUrl: './lista-recogida.component.html',
  styleUrls: ['./lista-recogida.component.css']
})
export class ListaRecogidaComponent implements OnInit {

  

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
  
  carrito_recogida: ItemCarrito[] = [];

  carrito_recogida_ordenado: ItemCarrito[] = [];


  carrito_recogida_copia!: ItemCarrito[];

  indices!: number[];
  indices_copia: number[] = [];



  total: number = 0;

  zona!:Zona;

  @Output() newItemEvent = new EventEmitter<number>();

  addNewItem(value: number) {
    this.newItemEvent.emit(value);
  }

  get_output(value:number){
    this.newItemEvent.emit(value);
  }



  
  constructor(private pedidoService:PedidosService,
              private productosService: ProductosService,
              private zonaService: ZonaService,
              public dialog: MatDialog,
              private infoUsuarioService: InfoUsuarioService,
              private router:Router) { }



  async ngOnInit() {

    
    this.inicializar_carrito_recogida();
  

    
    
    //ORDENAR EL CARRITO POR Vendedores
  }

  async inicializar_carrito_recogida(){

    this.carrito_recogida = []
    this.indices_copia = []
    this.total = this.pedidoService.calcularPrecioTotal();
    this.cart = JSON.parse(localStorage.getItem("cart")!) || [];
    this.pedidoService.cart = JSON.parse(localStorage.getItem("cart")!) || [];

    for(let item of this.cart){
      if(item.recogida != 'envio'){
        this.carrito_recogida.push(item);
        this.indices_copia.push(item.id_productor);
      }
    }

    await this.ordenar_carro(this.carrito_recogida);
  }

  async ordenar_carro(carrito_recogida : ItemCarrito[]){

    this.carrito_recogida_copia = this.carrito_recogida;
    
    this.carrito_recogida_ordenado = this.groupBy(carrito_recogida,"id_productor")

    console.log(this.carrito_recogida);

    this.indices = this.indices_copia.filter((item,index)=>{
      return this.indices_copia.indexOf(item) === index;
    })

    if(this.cart.length == 0){
      this.router.navigate(['/productos/listado'])
    }

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


  get_nombre_productor(indice: number): string{
    this.infoUsuarioService.getInfoUsuario(indice)
      .subscribe(usuario => {
        localStorage.setItem("usuario",JSON.stringify(usuario));
      })

      if(localStorage.getItem("usuario")){
        let usuario = JSON.parse(localStorage.getItem("usuario")!);
        localStorage.removeItem("usuario")
  
        return usuario.nombre;
      }else{
        return "";
      }
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
  
      for (let item of this.carro_ordenado){
  
        this.productosService.getProductoPorId(item.id_producto)
          .subscribe(producto => {
              item.precio = producto.precio;
          })
        
        if((item.estado != "No Disponible" && item.estado != "No Stock") && item.pago_recogida == 0 && item.recogida == "envio" ){
          this.total = this.total + (item.precio * item.cantidad);
        }
        if((item.estado != "No Disponible" && item.estado != "No Stock") && item.pago_recogida == 0 && item.recogida != "envio" ){ //COMISION
  
          let precio_recogida = (item.precio * item.cantidad) + (item.precio * item.cantidad)
          this.total = this.total + precio_recogida;
        }
        if((item.estado != "No Disponible" && item.estado != "No Stock") && item.pago_recogida == 1 && item.recogida != "envio" ){ //COMISION
  
          let precio_recogida = (item.precio * item.cantidad)
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
      this.inicializar_carrito_recogida();
      
    });
  }


  DialogDondeRecojo(): void {
    const dialogRef = this.dialog.open(TextoPopComponent, {
      maxHeight: 'calc(100%)',
      maxWidth: 'calc(100vw - 10px)',
      data: 'Pulsa el icono del lápiz para ver la dirección de recogida de cada uno de tus productos. Una vez realices el pedido podrás ver la dirección en tus pedidos.'
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.ordenar_carro();
      
    });
  }

}
