import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { Comentario } from 'src/app/productos/interfaces/comentario.interface';
import { Producto } from 'src/app/productos/interfaces/productos.interface';
import { Usuario } from 'src/app/productos/interfaces/usuario.interface';
import { InfoUsuarioService } from 'src/app/productos/services/info-usuario.service';
import { ProductosService } from 'src/app/productos/services/productos.service';

@Component({
  selector: 'app-item-comentario',
  templateUrl: './item-comentario.component.html',
  styleUrls: ['./item-comentario.component.css']
})
export class ItemComentarioComponent implements OnInit {


  @Input() item!: Comentario;

  estado:string = "";

  infouser!: Usuario;
  producto!: Producto;

  constructor(private infoUsuarioService: InfoUsuarioService,
              private productoService: ProductosService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    
    this.infoUsuarioService.getInfoUsuario(this.item.id_usuario).pipe(
      switchMap( infouser => {
        this.infouser = infouser
        return this.productoService.getProductoPorId(""+this.item.id_producto)
      })
    ).subscribe(producto => {
      this.producto = producto
    })
  }

  cambiar_estado(){
    
    console.log(this.item)
    this.productoService.updateComentario(this.item)
      .subscribe(comentario => {
        this.mostrarSnakbar("¡Comentario actualizado!")
      })
  }

  mostrarSnakbar( mensaje: string ) {

    this.snackBar.open( mensaje, 'ok!', {
      duration: 2500
    });

  }

}
