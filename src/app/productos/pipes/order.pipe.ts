import { Pipe, PipeTransform } from "@angular/core";
import { Producto } from "../interfaces/productos.interface";

@Pipe({
  name: "sort",
  pure: false

})
export class ArraySortPipe  implements PipeTransform {
  transform(productos: Producto[]): Producto[] {
    if (!Array.isArray(productos)) {
      return productos;

    }
    productos.sort((a: any, b: any) => {
      if (a.distancia_punto < b.distancia_punto) {
        return -1;
      } else if (a.distancia_punto > b.distancia_punto) {
        return 1;
      } else {
        return 0;
      }
    });
    return productos;
  }
}
