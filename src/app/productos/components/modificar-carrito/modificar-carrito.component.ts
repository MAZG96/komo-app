import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { DatosPedidoComponent } from '../../pages/datos-pedido/datos-pedido.component';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { PedidosService } from '../../services/pedidos.service';
import { ConfirmarComponent } from '../confirmar/confirmar.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-modificar-carrito',
  templateUrl: './modificar-carrito.component.html',
  styleUrls: ['./modificar-carrito.component.css']
})
export class ModificarCarritoComponent implements OnInit {

  cart!: ItemCarrito[];

  usuario!: Usuario;

  tpo!: number;

  cargado:boolean = false;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public item: ItemCarrito,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<DatosPedidoComponent>,
              private infousuarioService: InfoUsuarioService,
              private sharedService: SharedService,
              private pedidoService: PedidosService) { }


  ngOnInit(): void {
    this.cart = this.sharedService.Getcarro_compra;

    this.tpo = this.sharedService.Gettipo_venta;

    if(this.item.recogida != 'envio'){
      this.infousuarioService.getInfoUsuario(this.item.id_productor)
        .subscribe(usuario => {
          this.usuario = usuario
          this.cargado = true;
        })

    }else{
      this.cargado = true;
    }
  }

  buscar(){
    return this.sharedService.Getcarro_compra.find(it=> it.id_producto == this.item.id_producto);
  }


  delete(itemcarrito: ItemCarrito){

    let elemento = this.buscar();

    const item: number = this.sharedService.Getcarro_compra.indexOf(elemento!);

    console.log(item)

    if(item != -1){

      this.pedidoService.cart.splice(item,1)

      this.sharedService.Getcarro_compra.splice(item,1)


      localStorage.setItem("cart",JSON.stringify(this.pedidoService.cart));

      this.cart = this.sharedService.Getcarro_compra;

      this.dialogRef.close();

    }


  }


  borrarproducto() {

    const dialog = this.dialog.open( ConfirmarComponent, {
      width: '250px',
      data: this.item
    });

    dialog.afterClosed().subscribe(
      (result) => {

        if( result ) {
          this.delete(this.item)
        }
        
      }
    )

  }


}
