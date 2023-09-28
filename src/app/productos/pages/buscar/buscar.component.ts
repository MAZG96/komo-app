import { Component, HostListener, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { Feature } from 'src/app/maps/interfaces/place';
import { MapSearchComponent } from 'src/app/maps/screens/map-search/map-search.component';
import { ElegirzonaComponent } from '../../components/elegirzona/elegirzona.component';
import { Producto } from '../../interfaces/productos.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import * as turf from '@turf/turf'
import { Zona } from '../../interfaces/zona.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { ProductosService } from '../../services/productos.service';
import { Categoria } from '../../interfaces/categoria.interfaces';
import { CategoriaComponent } from '../../components/categoria/categoria.component';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
})
export class BuscarComponent implements OnInit {
  
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

  busqueda_productos: boolean = false;
  busqueda_productores: boolean = false;
  
 

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

  lugar_elegido?: Feature;
  direc:string = "Ubicacion";
  productos_copia!: Producto[];
  categoria_elegida?: Categoria;
  busqueda_vacia:boolean = false;
  resultado_productos_distancia: Producto[] = [];






  titulo_zona:string = "Zona";
  zona: Zona = {
    id: 0,
    nombre: '',
    cp_inicio: '',
    direccion: '',
    horario: '',
    provincia: '',
    cp_fin: ''
  };

  constructor( private productosService: ProductosService,
               private infoUsuarioService: InfoUsuarioService,
               public dialog: MatDialog ) { }

  ngOnInit(): void {

    this.categorias = this.productosService.categorias;

    if(localStorage.getItem("LOC")){
      this.lugar_elegido = JSON.parse(localStorage.getItem("LOC")!);
      this.direc = this.lugar_elegido!.place_name;
      this.recarga_lista();
      this.busqueda_productos = true;

    }else{

      this.productosService.getProductos()
          .subscribe(productos=> {
            this.todos_productos = productos;
            this.productos = productos
            this.cargado = true;
          });

      this.infoUsuarioService.getInfoUsuarios()
        .subscribe(usuarios => {
          this.todos_usuarios = usuarios;
          this.usuarios = usuarios;

        })
      
      this.busqueda_productos = true;

    }


    if(localStorage.getItem("zona_busqueda")){

      this.zona = JSON.parse(localStorage.getItem("zona_busqueda")!);
      this.titulo_zona = this.zona.provincia;
      this.busqueda_zonas = true;
      this.buscando()

    }

    this.cargado = true;

    
      
  }


  filtrar_recogida(productos: Producto[], usuarios: Usuario[]){
    if(this.envio){
      productos = this.todos_productos;
      this.envio= false;
    }
    if(this.recogida){
      this.recogida = false;
      this.buscando();

    }else{
      this.recogida = true;
      if(productos.length > 0){
        this.busqueda_productos = true;
        this.busqueda_productores = false;
        let copy_productos:Producto[] = [];
        for(let producto of productos){
          
          this.infoUsuarioService.getInfoUsuario(producto.id_usuario)
            .subscribe(usuario => {

              if(this.get_distancia_producto(producto) != undefined){
                producto.distancia_punto = this.get_distancia_producto(producto);
              }

              if(this.zona.id !=0){
                if(usuario.recogida != 0 && usuario.zona == this.zona.id){
                  copy_productos.push(producto);
                }
              }else{
                if(usuario.recogida != 0){
                  copy_productos.push(producto);
                }
              }
              
            })
        }
        this.productos = copy_productos;
        this.cargado = true;
      }
      
      if(usuarios.length > 0){
        this.busqueda_productos = true;
        let copy_usuarios:Usuario[] = [];
        for(let usuario of usuarios){

              if(this.zona.id !=0){
                if(usuario.recogida != 0 && usuario.zona == this.zona.id){
                  copy_usuarios.push(usuario);
                }
              }else{
                if(usuario.recogida != 0){
                  copy_usuarios.push(usuario);
                }
              }
              
          }
          this.usuarios = copy_usuarios;
      }
    }

    this.cargado = true;

  }

  filtrar_envio(productos: Producto[]){

    if(this.recogida){
      productos = this.todos_productos;
    }
    this.recogida = false;
    if(this.envio){
      this.envio = false;
      this.buscando();
    }else{
      this.envio = true;
      if(productos.length > 0){
        this.busqueda_productos = true;
        let copy_productos:Producto[] = [];
        for(let producto of productos){

          if(this.get_distancia_producto(producto) != undefined){
            producto.distancia_punto = this.get_distancia_producto(producto);
          }
          
          this.infoUsuarioService.getInfoUsuario(producto.id_usuario)
            .subscribe(usuario => {
              
              if(usuario.envio_frio == 1 || usuario.zona != 0){ //VENDE FRIO O UNIFICA PRODUCTOS
                
                copy_productos.push(producto);
                
              }
            })
        }
      
        this.productos = copy_productos;
        this.cargado = true;

      }
      this.cargado = true;

      return;
    }


  }
  buscando() {

    this.busqueda_productos = false;
    this.busqueda_productores = false;
    this.envio = false;
    this.categoria_elegida = undefined;
    this.recogida = false;


    if(this.termino.trim().length == 0){
        if(localStorage.getItem("LOC")){
          this.lugar_elegido = JSON.parse(localStorage.getItem("LOC")!);
          this.direc = this.lugar_elegido!.place_name;
          this.recarga_lista();
          this.busqueda_productos = true;
        }
        else{
      
      this.productosService.getProductos()
        .subscribe(productos=> {
          
          if(this.zona.id != 0 && productos.length > 0){
            let copy_productos:Producto[] = [];
            this.busqueda_productos = true;
            for(let producto of productos){

              if(this.get_distancia_producto(producto) != undefined){
                producto.distancia_punto = this.get_distancia_producto(producto);
              }

              this.infoUsuarioService.getInfoUsuario(producto.id_usuario)
                .subscribe(usuario => {
                  if(usuario.zona == this.zona.id){
                    copy_productos.push(producto);
                  }
                })
            }
            this.productos = copy_productos;
            this.todos_productos = copy_productos;
            this.cargado = true;
          }else{
            for(let producto of productos){
              if(this.get_distancia_producto(producto) != undefined){
                producto.distancia_punto = this.get_distancia_producto(producto);

              }

            }

            
            this.productos = productos;
            this.busqueda_productos = true;
            this.cargado = true;
          }
        });

      this.infoUsuarioService.getInfoUsuarios()
        .subscribe(usuarios => {
          
          if(this.zona.id != 0 && usuarios.length > 0){
            let copy_usuarios:Usuario[] = [];
            //this.busqueda_productos = true;
            for(let usuario of usuarios){ 
                  if(usuario.zona == this.zona.id)
                    copy_usuarios.push(usuario);      
            }
            this.usuarios = copy_usuarios;
            this.todos_usuarios = copy_usuarios;
            this.cargado = true;

          }else{
            this.usuarios = usuarios;
            this.cargado = true;

          }
        })
      }
    }else{

    this.productosService.getSugerencias( this.termino.trim() )
      .subscribe( productos => {

        if(this.zona.id != 0 && productos.length > 0){
          let copy_productos:Producto[] = [];
          this.busqueda_productos = true;
          for(let producto of productos){

            if(this.get_distancia_producto(producto) != undefined){
              producto.distancia_punto = this.get_distancia_producto(producto);
            }

            this.infoUsuarioService.getInfoUsuario(producto.id_usuario)
              .subscribe(usuario => {
                if(usuario.zona == this.zona.id)
                  
                  copy_productos.push(producto);
              })
          }
          this.productos = copy_productos;
          this.todos_productos = copy_productos;
          this.cargado = true;

        }else{
          for(let producto of productos){
            if(this.get_distancia_producto(producto) != undefined){
              producto.distancia_punto = this.get_distancia_producto(producto);
            }
          }

          this.productos = productos
          this.todos_productos = productos;
          this.cargado = true;

        }

        if(productos.length > 0){
          this.busqueda_productos = true;
        }else{
          this.busqueda_productos = false;
        }
        

      });

    this.infoUsuarioService.getSugerenciasProductores( this.termino.trim() )
    .subscribe( usuarios => {
      if(!this.busqueda_productos && usuarios.length > 0){
        this.busqueda_productores = true;
      }else{
        this.busqueda_productores = false;
      }
      if(this.zona.id != 0){
        let copy_usuarios: Usuario[] = [];
        for(let usuario of usuarios){
          if(usuario.zona == this.zona.id){
            copy_usuarios.push(usuario);
          }
        }
        this.usuarios = copy_usuarios;
      }else{
        this.usuarios = usuarios
      }
    } );

  }

  this.cargado = true;

    

  }

  
  elegir_zona(): void {

    if(this.busqueda_zonas){
      this.titulo_zona = "Zona";
      localStorage.removeItem("zona_busqueda");
      this.zona = {
        id: 0,
        nombre: '',
        cp_inicio: '',
        direccion: '',
        horario: '',
        provincia: '',
        cp_fin: ''
      };

      this.busqueda_zonas = false;
      this.buscando();
      
    }else{

      const dialogRef = this.dialog.open(ElegirzonaComponent, {
        maxHeight: 'calc(100% - 32px)',
        maxWidth: 'calc(100vw - 32px)',
        panelClass: 'full-screen-modal',
      });

      dialogRef.afterClosed().subscribe(result => {
    
        if(localStorage.getItem("zona_busqueda")){
          this.zona = JSON.parse(localStorage.getItem("zona_busqueda")!);
          this.titulo_zona = this.zona.provincia;
          this.busqueda_zonas = true;
          this.buscando();
        }

        
      });

  }
  }

  opcionSeleccionada( event: MatAutocompleteSelectedEvent ) {

    if(!event.option.value) {
      this.productoSeleccionado = undefined;
      return;
    }

    const producto: Producto = event.option.value;
    this.termino = producto.nombre;

    this.productosService.getProductoPorId( producto.id! )
      .subscribe( producto => this.productoSeleccionado = producto );
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

  get_distancia_producto(producto:Producto): number | undefined{
    for(let item of this.resultado_productos_distancia){
      if(producto.id == item.id){
        return item.distancia_punto;
      }
    }
    return undefined;
  }

  recarga_lista(){

    this.termino = "";
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
          this.resultado_productos_distancia = this.productos_copia;
          if(this.zona.id != 0){

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
          this.resultado_productos_distancia = productos_resultado;
        }else{
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
          this.resultado_productos_distancia = this.productos_copia;

          if(this.zona.id != 0){

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
          this.resultado_productos_distancia = productos_resultado;
        }else{
          if (this.productos.length == 0){
            this.busqueda_vacia = true;

          }
        }

        });
      }
  }


  buscar_productores(){
    this.busqueda_productores = true;
    this.busqueda_productos = false;
  }

  buscar_productos(){
    this.busqueda_productores = false;
    this.busqueda_productos = true;
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
        this.recarga_lista();
      }
      
    });
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
}
