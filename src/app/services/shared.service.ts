import { Injectable } from '@angular/core';
import { ItemCarrito } from '../productos/interfaces/carrito.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private productoId !:number;

  private productoId_back !:number;

  private page_back !:number;

  private tipo_venta !: number;

  private carro_compra!: ItemCarrito[];

  constructor() { }

  set Setcarro_compra(carro:ItemCarrito[]){
    this.carro_compra = carro;
  }

  get Getcarro_compra(): ItemCarrito[]{
    return this.carro_compra;
  }

  set Settipo_venta(tp:number){
    this.tipo_venta = tp;
  }

  get Gettipo_venta():number{
    return this.tipo_venta;
  }

  set SetproductoId(id_producto:number){
    this.productoId = id_producto;
  }

  get GetproductoId():number{
    return this.productoId;
  }


  set SetproductoId_back(id_producto:number){
    this.productoId_back = id_producto;
  }

  get GetproductoId_back():number{
    return this.productoId_back;
  }

  set Setpage_back(id_producto:number){
    this.page_back = id_producto;
  }

  get Getpage_back():number{
    return this.page_back;
  }
}
