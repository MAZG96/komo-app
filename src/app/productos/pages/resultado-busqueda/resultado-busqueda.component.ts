import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Categoria } from '../../interfaces/categoria.interfaces';
import { Producto } from '../../interfaces/productos.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { ProductosService } from '../../services/productos.service';
import * as turf from '@turf/turf'


@Component({
  selector: 'app-resultado-busqueda',
  templateUrl: './resultado-busqueda.component.html',
  styleUrls: ['./resultado-busqueda.component.css']
})
export class ResultadoBusquedaComponent implements OnInit {

  productos!: Producto[];

  productos_copia!: Producto[];

  usuarios!: Usuario[];

  categoria!: Categoria;
  
  
  constructor( private productosService: ProductosService,
               private activatedRoute: ActivatedRoute,
               private infoUsuarioService: InfoUsuarioService) { }

  ngOnInit(): void {

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.productosService.getProductoPorIdCategoria( id ) )
      ).pipe(
        switchMap(productos => {
          if(productos.length != 0){
            this.categoria = this.productosService.categorias[productos[0].id_categoria]
            this.productos_copia = productos;
            localStorage.setItem("productos",JSON.stringify(productos))
          }
          else{
            this.productos = [];
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

          console.log(this.productos)
    
        })


  }

  ordenar_por_distancia(usuarios: Usuario[], productos_copia: Producto[]): Usuario[]{

    if(localStorage.getItem("LOC")){
      let lugar = JSON.parse((localStorage.getItem("LOC")!));

    for(let usuario of usuarios){
      let from = turf.point([Number(usuario.coord_x), Number(usuario.coord_y)]);
      let to = turf.point([lugar!.geometry.coordinates[0], lugar!.geometry.coordinates[1]]);
      usuario.distancia_punto = turf.distance(from, to);
      
    }

  }



  for(let producto of productos_copia){
    for(let usuario of usuarios){
      if(producto.id_usuario == usuario.id_usuario){
        producto.distancia_punto = usuario.distancia_punto;
      }
    }
  }

  productos_copia.sort((n1,n2) => {
    if (n1.distancia_punto! > n2.distancia_punto!) {
        return 1;
    }

    if (n1.distancia_punto! < n2.distancia_punto!) {
        return -1;
    }

    return 0;
  });

  this.productos = productos_copia;

  console.log(this.productos)
    return usuarios;
  }
}

