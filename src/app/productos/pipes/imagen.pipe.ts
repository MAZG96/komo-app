import { LowerCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Producto } from '../interfaces/productos.interface';

@Pipe({
  name: 'imagen',
  pure: false
})
export class ImagenPipe implements PipeTransform {

  transform( producto: Producto ): string {

    if(producto.foto == '' ) {
      return `${environment.path_node}/no-image.png`;
    } else {
      return producto.foto;
    }
  }

}
