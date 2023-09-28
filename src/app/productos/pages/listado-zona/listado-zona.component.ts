import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Producto } from '../../interfaces/productos.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-listado-zona',
  templateUrl: './listado-zona.component.html',
  styleUrls: ['./listado-zona.component.css']
})
export class ListadoZonaComponent implements OnInit {

  productos: Producto[] = []

  pages: number = 1;
  dataset: any[] = ['1','2','3','4','5','6','7','8','9','10'];
  
  
  constructor( private productosService: ProductosService,
               private infoUsuarioService: InfoUsuarioService) { }

  ngOnInit(): void {

    this.productosService.getProductos()
      .subscribe( productos => {
        for(let producto of productos){

          this.infoUsuarioService.getInfoUsuario(producto.id_usuario)
            .subscribe(usuario => {
              if(usuario.zona == 1){
                this.productos.push(producto);
              }
            })
        }
      }
        );

      


  }

}
