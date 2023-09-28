import { Component, HostListener, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../interfaces/productos.interface';
import { Categoria } from '../../interfaces/categoria.interfaces';
import { Feature } from 'src/app/maps/interfaces/place';
import { MapSearchComponent } from 'src/app/maps/screens/map-search/map-search.component';
import { MatDialog } from '@angular/material/dialog';
import * as turf from '@turf/turf'
import { switchMap } from 'rxjs/operators';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { Zona } from '../../interfaces/zona.interface';
import { UnificarComponent } from '../../components/unificar/unificar.component';
import { CategoriaComponent } from '../../components/categoria/categoria.component';
import { Router } from '@angular/router';
import { ElegirzonaComponent } from '../../components/elegirzona/elegirzona.component';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styles:[`

  .seleccion{
    font-weight: normal;
    cursor: pointer;
  }

  .seleccion-activa{
    font-weight: bold;
    cursor: pointer;

  }
  
  .flecha-volver{
    display: none;
  }

  .lista-tipo{
    flex-flow: row wrap;box-sizing: border-box;display: flex;place-content: stretch center;align-items: stretch;justify-content: space-around;
  }

  .btn-comprar{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
    padding: 1em;
    background-color: transparent;
    justify-content: center;
    margin-bottom:55px;
  }

  .selector_categoria{
      color:rgba(0, 0, 0, 0.87);
      background-color: transparent;
      border: 0;
      width: 90px;
      position: fixed;
      left: 0;
      color: transparent;
  }

  .caja-producto{
    display: flex;
    flex: auto;
    text-align:center;
  }

  .mat-chip-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 20px !important;
    margin-bottom: 20px !important;
  }

  .flecha{
      color: black;
  }

  .mat-chip{
    background-color: white!important;
    color: black;
    border: 1px solid black;
  }

  .mat-chip:hover{
    background-color: white!important;
    color: black;
    border: 1px solid black;
  }

  .mat-chip:active{
    background-color: white!important;
    color: black;
    border: 1px solid black;
  }

  mat-icon{
    color: black;
    
  }

  .center {
    margin: auto;
    width: 100%;
    padding: 10px;
  }

  .scrollmenu{
    width:100%;
    overflow: auto;
  white-space: wrap;
  }

  mat-chip-list{
    position: fixed;
    padding: 10px;
    top: 35px;
    z-index: 1000;
    display: flex;
    align-items:center;
    justify-content: center;
    background-color: white;
    border-bottom: 0px solid;
  }

  `]
})

export class ListadoComponent implements OnInit {

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
  //In chrome and some browser scroll is given to body tag
  let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
  let max = document.documentElement.scrollHeight;


  // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
  if(pos >= max-100 )   {
    this.end += 6
  }
  }

  start: number = 0;
  end: number = 6;
  atBottom = false;

  productos!: Producto[];
  productos_copia!: Producto[];
  usuarios!: Usuario[];
  categorias!: Categoria[];
  selectedCar!: string;
  categoria_elegida?: Categoria;
  
  zona: Zona = {
    id: 0,
    nombre: '',
    cp_inicio: '',
    direccion: '',
    horario: '',
    provincia: '',
    cp_fin: ''
  };

  lugar_elegido?: Feature;
  direc:string ="";
  pages: number = 1;
  dataset: any[] = ['1','2','3','4','5','6','7','8','9','10'];
  cargado: boolean = false;

  busqueda_vacia:boolean = false;

  zona_elegida!: Zona;

  tipo_venta:number = 0; // 0-UNIFICAR 1-ENVIO INDIVIDUAL 2-RECOGIDA 3-FRIO

  constructor( private productosService: ProductosService,
               public dialog: MatDialog,
               public router: Router,
               private infoUsuarioService: InfoUsuarioService) { }

  async ngOnInit(): Promise<void> {

    this.productos = [];

    this.categorias = this.productosService.categorias;

    if(localStorage.getItem("LOC")){
      this.lugar_elegido = JSON.parse(localStorage.getItem("LOC")!);
      this.recarga_lista();
    }else{

      this.router.navigate(['./']);
    }
    



     

    await this.infoUsuarioService.delay(1500);

      this.cargado = true;

  }

    cargar_venta(tipo : number){
      this.tipo_venta = tipo;

      if(this.tipo_venta == 1){
        this.elegir_zona();
      }else{
        this.recarga_lista();

      }


    }


    elegir_zona(): void {

        const dialogRef = this.dialog.open(ElegirzonaComponent, {
          maxHeight: 'calc(100% - 32px)',
          maxWidth: 'calc(100vw - 32px)',
          panelClass: 'full-screen-modal',
        });
  
        dialogRef.afterClosed().subscribe(result => {
      
          if(localStorage.getItem("zona_busqueda")){
            this.zona = JSON.parse(localStorage.getItem("zona_busqueda")!);
            localStorage.removeItem("zona_busqueda");
            this.recarga_lista();
          }else{
            this.tipo_venta = 0;
            this.recarga_lista();
          }
  
          
        });
  
    }

  //USAR ESTA FUNCION PARA REALIZAR LA BUSQUEDA
   recarga_lista(){

    this.pages = 0;
    this.busqueda_vacia = false;

    this.productos = [];
    
    if(this.categoria_elegida != undefined){
    this.productosService.getProductoPorIdCategoria(""+this.categoria_elegida.id)
      .pipe(
        switchMap(productos => {
          if(productos.length != 0){

            this.productos_copia = productos;
            localStorage.setItem("productos",JSON.stringify(productos))
          }
          else{
            this.productos = [];
            this.productos_copia = [];
           
          }

          return  this.infoUsuarioService.getInfoUsuarios().pipe()
        })).subscribe(usuarios =>{
      
          this.usuarios = usuarios
          if(localStorage.getItem("LOC")){
            let lugar = JSON.parse((localStorage.getItem("LOC")!));
      
          for(let usuario of usuarios){
            let from = turf.point([Number(usuario.coord_x), Number(usuario.coord_y)]);
            let to = turf.point([lugar!.geometry.coordinates[0], lugar!.geometry.coordinates[1]]);
            usuario.distancia_punto = turf.distance(from, to);
            
          }
        }

          for(let producto of this.productos_copia){
            for(let usuario of usuarios){
              if(producto.id_usuario == usuario.id_usuario){
                producto.distancia_punto = usuario.distancia_punto;
              }
            }
          }
        
          this.productos_copia.sort((n1,n2) => {
            if (n1.distancia_punto! > n2.distancia_punto!) {
                return 1;
            }
        
            if (n1.distancia_punto! < n2.distancia_punto!) {
                return -1;
            }
        
            return 0;
          });
          this.productos = JSON.parse(localStorage.getItem("productos")!) || [];
          localStorage.removeItem("productos");

          this.productos = this.productos_copia;

          
          this.productos = JSON.parse(localStorage.getItem("productos")!) || [];
          localStorage.removeItem("productos");

          this.productos = this.productos_copia;

          if(this.tipo_venta == 1){

            let productos_resultado = [];

            for(let producto of this.productos){
            for(let usuario of usuarios){
              if(usuario.id_usuario == producto.id_usuario && usuario.zona == this.zona.id){
                
                productos_resultado.push(producto)
              }
            }
          }

          if(productos_resultado.length == 0){
            this.busqueda_vacia = true;
          }
          this.productos = productos_resultado;
        
        }
        else if(this.tipo_venta == 2){ // ENVIO INDI
          let productos_resultado = [];

          for(let producto of this.productos){
            for(let usuario of usuarios){
              if(usuario.id_usuario == producto.id_usuario && usuario.recogida == 1){
                
                productos_resultado.push(producto)
              }
            }
          }

          if(productos_resultado.length == 0){
            this.busqueda_vacia = true;
          }
            this.productos = productos_resultado;
        }
        if(this.tipo_venta == 3){ // TRANSPORTE

          let productos_resultado = [];

          for(let producto of this.productos){
          for(let usuario of usuarios){
            if(usuario.id_usuario == producto.id_usuario && usuario.envio_individual == 1){
              
              productos_resultado.push(producto)
            }
          }
        }

        if(productos_resultado.length == 0){
          this.busqueda_vacia = true;
        }
        this.productos = productos_resultado;
      
      }
      if(this.tipo_venta == 0){

        let productos_resultado = [];

        for(let producto of this.productos){
        for(let usuario of usuarios){
          if(usuario.id_usuario == producto.id_usuario && usuario.zona == this.zona.id){
            
            productos_resultado.push(producto)
          }
        }
      }

      if(productos_resultado.length == 0){
        this.busqueda_vacia = true;
      }
      this.productos = productos_resultado;
    
    } 
      else{
          if (this.productos.length == 0){
            this.busqueda_vacia = true;

          }
        }

        });

      }else{

        this.productosService.getProductos()
      .pipe(
        switchMap(productos => {
          if(productos.length != 0){
            this.productos_copia = productos;
            localStorage.setItem("productos",JSON.stringify(productos))
          }
          else{
            this.productos = [];
            this.busqueda_vacia = true;
            console.log("no hay existencias");
          }

          return  this.infoUsuarioService.getInfoUsuarios().pipe()
        })).subscribe(usuarios =>{
      
          this.usuarios = usuarios
          if(localStorage.getItem("LOC")){
            let lugar = JSON.parse((localStorage.getItem("LOC")!));
      
          for(let usuario of usuarios){
            let from = turf.point([Number(usuario.coord_x), Number(usuario.coord_y)]);
            let to = turf.point([lugar!.geometry.coordinates[0], lugar!.geometry.coordinates[1]]);
            usuario.distancia_punto = turf.distance(from, to);
            
          }
      
          }

          for(let producto of this.productos_copia){
            for(let usuario of usuarios){
              if(producto.id_usuario == usuario.id_usuario){
                producto.distancia_punto = usuario.distancia_punto;
              }
            }
          }
        
          this.productos_copia.sort((n1,n2) => {
            if (n1.distancia_punto! > n2.distancia_punto!) {
                return 1;
            }
        
            if (n1.distancia_punto! < n2.distancia_punto!) {
                return -1;
            }
        
            return 0;
          });
          
          this.productos = JSON.parse(localStorage.getItem("productos")!) || [];
          localStorage.removeItem("productos");

          this.productos = this.productos_copia;
          
          
          if(this.tipo_venta == 1){ //UNIFICAR

            let productos_resultado = [];

            for(let producto of this.productos){
            for(let usuario of usuarios){
              if(usuario.id_usuario == producto.id_usuario && usuario.zona == this.zona.id){
                
                productos_resultado.push(producto)
              }
            }
          }

          if(productos_resultado.length == 0){
            this.busqueda_vacia = true;
          }
          this.productos = productos_resultado;
        
        }
        else if(this.tipo_venta == 2){ // RECOGIDA
          let productos_resultado = [];

          for(let producto of this.productos){
            for(let usuario of usuarios){
              if(usuario.id_usuario == producto.id_usuario && usuario.recogida == 1){
                
                productos_resultado.push(producto)
              }
            }
          }

          if(productos_resultado.length == 0){
            this.busqueda_vacia = true;
          }
            this.productos = productos_resultado;
        }
        if(this.tipo_venta == 3){ // FRIO

          let productos_resultado = [];

          for(let producto of this.productos){
          for(let usuario of usuarios){
            if(usuario.id_usuario == producto.id_usuario && usuario.envio_frio == 1){
              
              productos_resultado.push(producto)
            }
          }
        }

        if(productos_resultado.length == 0){
          this.busqueda_vacia = true;
        }
        this.productos = productos_resultado;
      
      }

      if(this.tipo_venta == 0){

        let productos_resultado = [];

        for(let producto of this.productos){
        for(let usuario of usuarios){
          if(usuario.id_usuario == producto.id_usuario && usuario.envio_individual == 1){
            
            productos_resultado.push(producto)
          }
        }
      }

      if(productos_resultado.length == 0){
        this.busqueda_vacia = true;
      }
      this.productos = productos_resultado;
    
     } 
      else{
          if (this.productos.length == 0){
            this.busqueda_vacia = true;

          }
        }

        });
      }
  }
    
  seleccionar_categoria(categoria: Categoria): void {
    this.categoria_elegida = categoria;
  }

  ver_mas(){
    this.end += 6;
  }

  checkthis(e: any){
    if(e.target.scrollHeight < e.target.scrollTop) {
      this.atBottom = true;
      console.log("abajo")
    } else {
      this.atBottom = false;
    }
  }

  borrar_ubicacion(): void {
    if(this.lugar_elegido){
      this.lugar_elegido = undefined;
      localStorage.removeItem("LOC")
    }

  }

  borrar_categoria(): void {
    if(this.categoria_elegida){
      this.categoria_elegida = undefined;

    }

  }

  borrar_zona(){
    this.zona = {
      id: 0,
      nombre: '',
      cp_inicio: '',
      direccion: '',
      horario: '',
      provincia: '',
      cp_fin: ''
    };

    localStorage.removeItem("zona")

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MapSearchComponent, {
      maxHeight: '100%',
      maxWidth: '100%',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: {lugar_elegido: this.lugar_elegido},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.lugar_elegido = result;
      if(localStorage.getItem("LOC") !== null){
        this.lugar_elegido = JSON.parse(localStorage.getItem("LOC")!);
        this.direc = this.lugar_elegido!.place_name;
        this.recarga_lista();
        
        
      }
      
    });
  }

  elegir_categoria(): void {
    const dialogRef = this.dialog.open(CategoriaComponent, {
      maxHeight: 'calc(100% - 32px)',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'full-screen-modal',
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if(localStorage.getItem("categoria") !== null){
        this.categoria_elegida = JSON.parse(localStorage.getItem("categoria")!);
        console.log(this.categoria_elegida)
        this.recarga_lista();
      }
      
    });
  }


  }  