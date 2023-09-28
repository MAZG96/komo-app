import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Comentario } from '../../interfaces/comentario.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { ProductosService } from '../../services/productos.service';
import { ConfirmarComponent } from '../confirmar/confirmar.component';

@Component({
  selector: 'app-comentarios-lista',
  templateUrl: './comentarios-lista.component.html',
  styleUrls: ['./comentarios-lista.component.css']
})
export class ComentariosListaComponent implements OnInit {

  constructor(private infoUsuarioService: InfoUsuarioService,
              private authService: AuthService,
              private productoService: ProductosService,
              public dialog: MatDialog) { }

  @Input() comentario!: Comentario;


  infoUser: Usuario = {
    id: '',
    nombre: '',
    nombre_empresa: '',
    ubicacion: '',
    coord_x: '',
    coord_y: '',
    foto: '',
    dias_publicados: '',
    id_usuario: 0
  }

  get auth(){
    return this.authService.auth;
  }


  ngOnInit(): void {


    this.infoUsuarioService.getInfoUsuario(this.comentario.id_usuario)
    .subscribe(usuario => {
      this.infoUser = usuario
    });


  }

  borrar_comentario() {

    const dialog = this.dialog.open( ConfirmarComponent, {
      width: '250px',
      data: this.comentario
    });

    dialog.afterClosed().subscribe(
      (result) => {

        if( result ) {
          this.productoService.borrarComentario( this.comentario )
            .subscribe( resp => {
              this.comentario.texto= '';
              this.comentario.valoracion =0;
            });
        }
        
      }
    )

  }

}
