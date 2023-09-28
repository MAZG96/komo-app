import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notificacion } from '../interfaces/notificacion.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private baseUrl: string = environment.baseUrl;


  constructor( private http: HttpClient ) { }

  insertarNotificacion(notificacion: Notificacion): Observable<Notificacion> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');
    
    return this.http.post<Notificacion>(`${ this.baseUrl }/notificaciones`, notificacion , {headers});
    
  }

  updateNotificacion(notificacion: Notificacion): Observable<Notificacion> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');
    
    return this.http.put<Notificacion>(`${ this.baseUrl }/notificaciones/${ notificacion.id_usuario }`, notificacion , {headers});
    
  }

  getNotificacion(id_usuario: number) : Observable<Notificacion> {
    
    return this.http.get<Notificacion>(`${ this.baseUrl }/notificaciones/${ id_usuario }`, );
    
  }
}
