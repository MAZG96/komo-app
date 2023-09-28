import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Auth } from 'src/app/productos/interfaces/auth.interfaces';
import { Producto } from 'src/app/productos/interfaces/productos.interface';
import { Usuario } from 'src/app/productos/interfaces/usuario.interface';
import { InfoUsuarioService } from 'src/app/productos/services/info-usuario.service';
import { ProductosService } from 'src/app/productos/services/productos.service';

@Component({
  selector: 'app-productor',
  templateUrl: './productor.component.html',
  styleUrls: ['./productor.component.css']
})
export class ProductorComponent implements OnInit {

  infoUser!: Usuario;

  auth!: Auth;

  enlace_correo!: string;
  enlace_telefono!: string;

  productos!: Producto[];

  constructor(private infoUsuarioService: InfoUsuarioService,
              private authService: AuthService,
              private productoService: ProductosService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {


    this.activatedRoute.params.pipe(
      switchMap( ({ id }) => this.infoUsuarioService.getInfoUsuario(id).pipe(
        switchMap(infouser => 
          {
            this.infoUser = infouser;
            this.enlace_telefono = "tel:+34"+infouser.telefono_envio;

            return this.productoService.getProductoPorUsuario(Number(infouser.id_usuario)).pipe(
              switchMap(productos =>
                {
                  this.productos = productos; 
                  
                  return this.authService.getUsuario(id)
                })
            )
          })
      )
    )
    ).subscribe(auth =>
      {
        this.auth = auth;  
        this.enlace_correo = "mailto:"+auth.email;
   
      });
  }

}
