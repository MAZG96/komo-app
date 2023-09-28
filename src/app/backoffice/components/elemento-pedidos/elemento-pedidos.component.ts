import { Component, Input, OnInit } from '@angular/core';
import { ItemCarrito } from 'src/app/productos/interfaces/carrito.interface';
import { Usuario } from 'src/app/productos/interfaces/usuario.interface';
import { InfoUsuarioService } from 'src/app/productos/services/info-usuario.service';
import { ProductosService } from 'src/app/productos/services/productos.service';
import { ZonaService } from '../../services/zona.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Auth } from 'src/app/productos/interfaces/auth.interfaces';

@Component({
  selector: 'app-elemento-pedidos',
  templateUrl: './elemento-pedidos.component.html',
  styleUrls: ['./elemento-pedidos.component.css']
})
export class ElementoPedidosComponent implements OnInit {

  @Input() item!: ItemCarrito;

  usuario!: Usuario;

  auth!: Auth;

  enlace_correo!: string;

  enlace_telefono!: string;


  constructor(private productoService: ProductosService,
              private authService: AuthService,
              private infoUsuarioService: InfoUsuarioService) { }

  ngOnInit(): void {  
    
    this.authService.getUsuario(this.item.id_productor)
      .subscribe(auth =>{
        this.auth = auth;
        this.enlace_correo = "mailto:"+auth.email;
      } )

    this.infoUsuarioService.getInfoUsuario(this.item.id_productor)
      .subscribe(usuario => {

        this.usuario = usuario;

        this.enlace_telefono = "tel:+34"+usuario.telefono_envio;
        
        if(this.item.recogida != 'envio'){
          this.usuario.calle = usuario.calle!.replace(/,/gi,', ');
        }else{
          usuario.calle = '';
        }
      })

  }

}
