import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import {  Producto } from '../interfaces/productos.interface';
import { environment } from '../../../environments/environment';
import { ItemCarrito } from '../interfaces/carrito.interface';
import { Categoria } from '../interfaces/categoria.interfaces';
import { Comentario } from '../interfaces/comentario.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private baseUrl: string = environment.baseUrl;

  unidades: Categoria[] = [
    { id: 0, text: 'kg' },
    { id: 1, text: 'gramos' },
    { id: 2, text: 'uds' },
    { id: 3, text: 'docena(s)' },
    { id: 4, text: 'litro(s)' },
    { id: 5, text: 'mililitros' },
 ];

  categorias: Categoria[] = [
    { id: 0, text: 'Frutas' },
    { id: 1, text: 'Verduras' },
    { id: 2, text: 'Flores Comestibles' },
    { id: 3, text: 'Plantas Aromáticas' },
    { id: 4, text: 'Carne' },
    { id: 5, text: 'Pescado' },
    { id: 6, text: 'Mariscos' },
    { id: 7, text: 'Huevos' },
    { id: 8, text: 'Aceitunas' },
    { id: 9, text: 'Frutos Secos' },
    { id: 10, text: 'Miel' },
    { id: 11, text: 'Hortalizas' },
    { id: 12, text: 'Legumbres' },
    { id: 13, text: 'Cereales' },
    { id: 14, text: 'Caracoles' },
    { id: 15, text: 'Setas' },
    { id: 16, text: 'Bebidas' },
    { id: 17, text: 'Aceite' },
    { id: 18, text: 'Pan y Bollería' },
    { id: 19, text: 'Quesos' },
    { id: 20, text: 'Fiambre' },
    { id: 21, text: 'Embutidos' },
    { id: 22, text: 'Cosmética' },   
    { id: 23, text: 'Otros' },    
 
  ];

  get get_categorias(){
    return this.categorias;
  }

  

  

  constructor( private http: HttpClient ) { }

  getProductos(): Observable<Producto[]> {
    
    return this.http.get<Producto[]>(`${ this.baseUrl }/productos`, );
    
  }

  getProductoPorId( id: string ):Observable<Producto> {
    return this.http.get<Producto>(`${ this.baseUrl }/productos/${ id }`);
  }

  getProductoPorIdCategoria( id: string ):Observable<Producto[]> {
    if(id == '20'){
      localStorage.setItem("titulo","Por Ubicación")
      return this.http.get<Producto[]>(`${ this.baseUrl }/productos`, );
    }
    return this.http.get<Producto[]>(`${ this.baseUrl }/productos/categoria/${ id }`);
  }

  getProductoPorUsuario( id_usuario: number):Observable<Producto[]> {
    return this.http.get<Producto[]>(`${ this.baseUrl }/productos/usuario/${ id_usuario }`);
  }

  getSugerencias( termino: string ): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${ this.baseUrl }/productos/busqueda/${ termino }`);
  }

  agregarProducto( Producto: Producto ): Observable<Producto> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    return this.http.post<Producto>(`${ this.baseUrl }/productos`, Producto , {headers});
  }

  actualizarProducto( Producto: Producto ): Observable<Producto> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');
    
    return this.http.put<Producto>(`${ this.baseUrl }/productos/${ Producto.id }`, Producto,{headers}  );
  }

  borrarProducto( id: string ): Observable<any> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    console.log("borrando")
    
    return this.http.delete<any>(`${ this.baseUrl }/productos/${ id }`,{headers} );
  }


  agregarComentario( Comentario: Comentario ): Observable<Comentario> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    return this.http.post<Comentario>(`${ this.baseUrl }/comentarios`, Comentario , {headers});
  }

  getComentariosProducto(id_producto: string): Observable<Comentario[]> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');


    return this.http.get<Comentario[]>(`${ this.baseUrl }/comentarios/producto/${ id_producto }`, {headers});
    
  }

  getComentariosProductor(id_productor: number): Observable<Comentario[]> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');


    return this.http.get<Comentario[]>(`${ this.baseUrl }/comentarios/productor/${ id_productor }`, {headers});
    
  }

  getComentarios(): Observable<Comentario[]> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');


    return this.http.get<Comentario[]>(`${ this.baseUrl }/comentarios/`, {headers});
    
  }

  updateComentario( comentario: Comentario): Observable<Comentario> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');
    
    return this.http.put<Comentario>(`${ this.baseUrl }/comentarios/${ comentario.id }`, comentario,{headers}  );
  }


  borrarComentario(Comentario: Comentario): Observable<Comentario[]> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');


    return this.http.delete<Comentario[]>(`${ this.baseUrl }/comentarios/${ Comentario.id }`, {headers});
    
  }

}
