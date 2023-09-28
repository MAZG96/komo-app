import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario.interface';

@Pipe({
  name: 'imagenuser',
  pure: false
})
export class ImagenUsuarioPipe implements PipeTransform {

  transform( usuario: Usuario): string {

    if(usuario){
    if(!usuario.foto) {
      return `${environment.path_node}/profile/no-image.png`;
    } else {
      return usuario.foto;
    }
  }else{
    return `${environment.path_node}/profile/no-image.png`;
  }
  }

}
