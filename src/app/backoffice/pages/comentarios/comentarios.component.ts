import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Comentario } from 'src/app/productos/interfaces/comentario.interface';
import { ProductosService } from 'src/app/productos/services/productos.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {

  comentarios!: Comentario[];

  constructor(private productoService: ProductosService) { }

  ngOnInit(): void {
    this.productoService.getComentarios()
      .subscribe( comentarios => this.comentarios = comentarios)
    
  }

}
