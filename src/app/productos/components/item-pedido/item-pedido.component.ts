import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { TextoRecogeComponent } from '../texto-recoge/texto-recoge.component';

@Component({
  selector: 'app-item-pedido',
  templateUrl: './item-pedido.component.html',
  styleUrls: ['./item-pedido.component.css']
})
export class ItemPedidoComponent implements OnInit {

  @Input() item!: ItemCarrito;

  @Input() recoger_pedido! :boolean;

  comprobar_recogida!: boolean;

  checked!: boolean;

  usuario!: Usuario;

  user: Usuario = {
    id: '',
    nombre: '',
    nombre_empresa: '',
    ubicacion: '',
    coord_x: '',
    coord_y: '',
    foto: '',
    zona: 0,
    calle: '',
    piso: '',
    horario: '',
    id_usuario: 0
  }

  constructor(private productosService:ProductosService,
              private infoUsuarioService:  InfoUsuarioService,
              private pedidoService:PedidosService,
              public dialog: MatDialog,) { }

  ngOnInit(): void {

      this.productosService.getProductoPorId(this.item.id_producto).pipe(
        switchMap( producto => {
          return this.infoUsuarioService.getInfoUsuario(producto.id_usuario)
        })
      ) 
      .subscribe(usuario => {

        this.user = usuario;
        
        if(this.user.recogida == 1){
          this.comprobar_recogida = true;
        }
        else{
          this.comprobar_recogida = false;
        }
        
      });

      this.infoUsuarioService.getInfoUsuario(this.item.id_productor)
      .subscribe(usuario => {

        this.usuario = usuario;

        
        if(this.item.recogida != 'envio'){
          this.usuario.calle = usuario.calle!.replace(/,/gi,', ');
        }else{
          usuario.calle = '';
        }
      })

  }


  DialogZonaConil(): void {
    const dialogRef = this.dialog.open(TextoRecogeComponent , {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  buscar(){
    return this.pedidoService.cart.find(item => item.id_producto == this.item.id_producto);
  }

  cambiar_recogida(){
    const item: number = this.pedidoService.cart.indexOf(this.buscar()!);

    console.log("asdasf"+item)


    if(item != -1){

      if(!this.checked){
        this.pedidoService.cart[item] = {
          id: this.pedidoService.cart[item].id,
          id_producto: this.pedidoService.cart[item].id_producto,
          id_productor: this.pedidoService.cart[item].id_productor,
          foto: this.pedidoService.cart[item].foto,
          cantidad: this.pedidoService.cart[item].cantidad,
          precio: this.pedidoService.cart[item].precio,
          nombre: this.pedidoService.cart[item].nombre,
          recogida: this.pedidoService.cart[item].recogida,
        }
      }else{
        
        this.pedidoService.cart[item] = {
          id: this.pedidoService.cart[item].id,
          id_producto: this.pedidoService.cart[item].id_producto,
          id_productor: this.pedidoService.cart[item].id_productor,
          foto: this.pedidoService.cart[item].foto,
          cantidad: this.pedidoService.cart[item].cantidad,
          precio: this.pedidoService.cart[item].precio,
          nombre: this.pedidoService.cart[item].nombre,
          recogida: this.pedidoService.cart[item].recogida
        }
        console.log(this.pedidoService.cart[item])
      }
      

      localStorage.setItem("cart",JSON.stringify(this.pedidoService.cart))
    }

    

  }
  

  

}
