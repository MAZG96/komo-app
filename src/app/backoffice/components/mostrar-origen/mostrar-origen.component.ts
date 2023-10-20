import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Auth } from 'src/app/productos/interfaces/auth.interfaces';
import { ItemCarrito } from 'src/app/productos/interfaces/carrito.interface';
import { Usuario } from 'src/app/productos/interfaces/usuario.interface';
import { InfoUsuarioService } from 'src/app/productos/services/info-usuario.service';
import { PedidosService } from 'src/app/productos/services/pedidos.service';
import { ProductosService } from 'src/app/productos/services/productos.service';

@Component({
  selector: 'app-mostrar-origen',
  templateUrl: './mostrar-origen.component.html',
  styleUrls: ['./mostrar-origen.component.css']
})
export class MostrarOrigenComponent implements OnInit {

  @Input() id_usuario!: number;

  @Input() item_pedidos!: ItemCarrito[];


  auth!: Auth;

  usuario!: Usuario;

  enlace_correo!: string;
  enlace_telefono!: string;

  peso_total: number = 0.0;

  precio_comision!: number;

  precio_envio: number =0.0;


  constructor(private authService: AuthService,
              private productoService: ProductosService,
              private pedidoService: PedidosService,
              private infoUsuarioService: InfoUsuarioService) { }

  ngOnInit(): void {
    this.authService.getUsuario(this.id_usuario)
      .subscribe(auth =>{
        this.auth = auth;
        this.enlace_correo = "mailto:"+auth.email;
      } )

    this.infoUsuarioService.getInfoUsuario(this.id_usuario)
      .subscribe(usuario => {

        this.usuario = usuario;

        this.enlace_telefono = "tel:+34"+usuario.telefono_envio;
        
      })


      

      this.productoService.getProductos()
      .subscribe(productos => {

        if(this.item_pedidos[0].peso_producto){
          for(let item of this.item_pedidos){

              this.peso_total += Number(item.peso_producto);

              this.precio_comision += (item.precio*item.cantidad)
            }

          }
          else{

            for(let o of productos){
              for(let item of this.item_pedidos){
    
                if(o.id == item.id_producto){
                  this.peso_total += o.peso_total;
    
                  this.precio_comision += (item.precio*item.cantidad)
                }
    
              }

          }    
        }

        if(this.item_pedidos[0].recogida == 'frio'){
          this.precio_envio = this.pedidoService.calcular_precio_envio_frio(this.peso_total);
        }else{
          this.precio_envio = this.pedidoService.calcular_precio_envio(this.peso_total);
        }

      })

  }

  calcular_comision(): number{

    this.precio_comision= 0.0;

    for(let item of this.item_pedidos){


        this.precio_comision += (item.precio*item.cantidad)

    }

    this.precio_comision = this.precio_comision * 0.03;


    return this.precio_comision;
  }

  
  

  }


