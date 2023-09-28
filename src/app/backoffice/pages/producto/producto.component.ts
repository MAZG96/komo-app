import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Categoria } from 'src/app/productos/interfaces/categoria.interfaces';
import { Producto } from 'src/app/productos/interfaces/productos.interface';
import { Usuario } from 'src/app/productos/interfaces/usuario.interface';
import { InfoUsuarioService } from 'src/app/productos/services/info-usuario.service';
import { ProductosService } from 'src/app/productos/services/productos.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  producto!: Producto;
  infoUser!: Usuario;

  categorias!: Categoria[];

  constructor(private activatedRoute: ActivatedRoute,
              private productoService: ProductosService,
              private infoUsuarioService: InfoUsuarioService) { }

  ngOnInit(): void {

    this.categorias = this.productoService.categorias;

    this.activatedRoute.params.pipe(
      switchMap( ({ id }) => this.productoService.getProductoPorId(id).pipe(
        switchMap(producto => 
          {
            this.producto = producto;
            return this.infoUsuarioService.getInfoUsuario(Number(producto.id_usuario)).pipe()
          })
      )
    )
    ).subscribe(infoUser =>
      {
        this.infoUser = infoUser;      
      });

  }

}
