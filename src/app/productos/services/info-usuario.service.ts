import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Favorito } from '../interfaces/favorito.interface';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class InfoUsuarioService {

  private baseUrl: string = environment.baseUrl;

  public centro_mapa?: [number, number] = [-6.546754756,32.3255325]
  

  constructor( private http: HttpClient ) { }

  getInfoUsuarios(): Observable<Usuario[]> {
    
    return this.http.get<Usuario[]>(`${ this.baseUrl }/info-usuario`, );
    
  }

  getInfoUsuario( id_usuario: number):Observable<Usuario> {
    return this.http.get<Usuario>(`${ this.baseUrl }/info-usuario/usuario/${ id_usuario }`);
  }

  getSugerencias( termino: string ): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${ this.baseUrl }/info-usuario?q=${ termino }&_limit=6`);
  }

  agregarInfoUsuario( Usuario: Usuario ): Observable<Usuario> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    return this.http.post<Usuario>(`${ this.baseUrl }/info-usuario`, Usuario , {headers});
  }

  actualizarInfoUsuario( Usuario: Usuario ): Observable<Usuario> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');
    
    return this.http.put<Usuario>(`${ this.baseUrl }/info-usuario/${ Usuario.id }`, Usuario,{headers}  );
  }

  actualizarDocURL( certificado: string, id: string ): Observable<Usuario> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');
    
    return this.http.put<Usuario>(`${ this.baseUrl }/info-usuario/${ id }`, {certificado},{headers}  );
  }

 
  añadirFavorito( favorito: Favorito): Observable<Favorito>{
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    return this.http.post<Favorito>(`${ this.baseUrl }/favoritos`, favorito , {headers});  
  }

  listarFavoritoUsuario( id_usuario: number): Observable<Favorito[]>{
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    return this.http.get<Favorito[]>(`${ this.baseUrl }/favoritos/usuario/${ id_usuario }`, {headers});  
  }

  getFavoritoUsuarioProductor( id_usuario: number, id_productor: number): Observable<Favorito>{
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    
    return this.http.get<Favorito>(`${ this.baseUrl }/favoritos/${ id_usuario }/${ id_productor }`, {headers});  
  }

  borrarFavorito( id :number ): Observable<any> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    return this.http.delete<any>(`${ this.baseUrl }/favoritos/${ id }`, {headers});
  }

  getSugerenciasProductores( termino: string ): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${ this.baseUrl }/info-usuario/busqueda/${ termino }`);
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  } 


}
