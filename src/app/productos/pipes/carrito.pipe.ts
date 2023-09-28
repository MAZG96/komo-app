import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ItemCarrito } from '../interfaces/carrito.interface';

@Pipe({
  name: 'carrito'
})
export class CarritoPipe implements PipeTransform {

  transform( item: ItemCarrito ): string {

    if(item.foto == '' ) {
      return `${environment.path_node}/no-image.png`;
    } else {
      return item.foto;
    }
  }

}
