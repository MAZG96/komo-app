import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Zona } from 'src/app/productos/interfaces/zona.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {

  private baseUrl: string = environment.baseUrl;

  

  constructor( private http: HttpClient ) { }

  listarZonas(): Observable<Zona[]> {
    
    return this.http.get<Zona[]>(`${ this.baseUrl }/zonas`, );
    
  }

  getZona( id: number):Observable<Zona> {
    return this.http.get<Zona>(`${ this.baseUrl }/zonas/${ id }`);
  }

  getZonaCP( cp: string):Observable<Zona> {
    return this.http.get<Zona>(`${ this.baseUrl }/zonas/cp/${ cp }`);
  }

  getZonasProvincia( provincia: string ): Observable<Zona[]> {
    return this.http.get<Zona[]>(`${ this.baseUrl }/zonas/cp/${ provincia }`, );
  }

  agregarZona( zona: Zona ): Observable<Zona> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    return this.http.post<Zona>(`${ this.baseUrl }/zonas`, zona , {headers});
  }

  actualizarZona( zona: Zona ): Observable<Zona> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');
    
    return this.http.put<Zona>(`${ this.baseUrl }/zonas/${ zona.id }`, zona ,{headers}  );
  }

  borrarZona( id :number ): Observable<any> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    return this.http.delete<any>(`${ this.baseUrl }/zonas/${ id }`, {headers});
  }


}
