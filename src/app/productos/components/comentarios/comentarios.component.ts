import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Comentario } from '../../interfaces/comentario.interface';
import { Producto } from '../../interfaces/productos.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {

  squareRate = 3;
  cssRate = 2.6;
  faRate = 4;
  movieRate = 0;
  verticalRate = 5;
  fontAwesomeRate = 2.5;

  @Input() producto!: Producto;

  comentario!: Comentario;


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

  comentarios!: Comentario[];

  constructor(private productoService: ProductosService,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private infoUserService: InfoUsuarioService) { }

  ngOnInit(): void {

    this.comentario = {
      id: 0,
      texto: '',
      valoracion: 0,
      estado: 'borrador',
      id_producto: Number(this.producto.id),
      id_productor: Number(this.producto.id_usuario),
      id_usuario: this.authService.auth.id
    }


    this.productoService.getComentariosProducto(this.producto.id)
    .subscribe(comentarios => this.comentarios = comentarios)   
    
  }

  get auth(){
    return this.authService.auth;
  }


  async guardar_comentario(){

    if(this.comentario.texto.length == 0 || this.comentario.valoracion == 0){
      this.mostrarSnakbar('Rellene los campos para añadir el comentario')
      return;
    }

    this.productoService.agregarComentario(this.comentario)
        .subscribe( producto => this.mostrarSnakbar('Comentario añadido'));


    this.comentario.texto = '';
    this.comentario.valoracion = 0;

    await this.delay(1000);

    this.productoService.getComentariosProducto(this.producto.id)
    .subscribe(comentarios => this.comentarios = comentarios) 
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  


  mostrarSnakbar( mensaje: string ) {

    this.snackBar.open( mensaje, 'OK', {
      duration: 2500
    });

  }

}
