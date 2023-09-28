import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Auth } from 'src/app/productos/interfaces/auth.interfaces';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthResponse, } from '../interfaces/auth.interfaces';
import { SharedService } from 'src/app/services/shared.service';
import { PedidosService } from 'src/app/productos/services/pedidos.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _auth :Auth | undefined

  get auth(): Auth {
    return { ...this._auth! };
  }

  constructor(private http: HttpClient,
              private sharedService: SharedService,
              private pedidoService: PedidosService) { } 


  login_google( token: string) {

    const url = `${this.baseUrl}/auth/google`;
    const body = {token};
    
    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap( resp => { 
          if(resp.ok ){
            localStorage.setItem('token', resp.token!);
        
          }
        }),
        map( resp => resp.ok ), //devuelve true si login correcto
        catchError (err => of(err.error.msg)) //of para cast to boolean to observable,devuelve false mal login
      );             
  }

  
  getUsuario( id: number ):Observable<Auth> {
    return this.http.get<Auth>(`${ this.baseUrl }/auth/usuario/${ id }`);
  }
  
  getUsuariosInactivos():Observable<Auth[]> {


    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    return this.http.get<Auth[]>(`${ this.baseUrl }/auth/inactivos/`,{headers});
  }

  recuperar(correo : string){
    const url = `${this.baseUrl}/auth/recuperacion`;
    const body = {correo};

    return this.http.put<AuthResponse>(url, body)
      .pipe(
        tap( resp => { 
        }),
        map( resp => resp.ok ), //devuelve true si login correcto
        catchError (err => of(err.error.msg)) //of para cast to boolean to observable,devuelve false mal login
      ); 
  }

  activarCuenta( id: number ): Observable<Auth> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');
    
    return this.http.put<Auth>(`${ this.baseUrl }/auth/activarcuenta/${ id }`,{headers}  );
  }

  restablecer(password : string, token: string){
    const url = `${this.baseUrl}/auth/restablecer`;
    const body = {password};

    console.log(token)

    const headers = new HttpHeaders()
    .set('x-token', token || '');

    return this.http.put<AuthResponse>(url, body, { headers })
      .pipe(
        tap( resp => { 
        }),
        map( resp => resp.ok ), //devuelve true si login correcto
        catchError (err => of(err.error.msg)) //of para cast to boolean to observable,devuelve false mal login
      ); 
  }

  activar( token: string) {

    const url = `${this.baseUrl}/auth/activar`;
    const body = {token};
    
    return this.http.put<AuthResponse>(url, body)
      .pipe(
        tap( resp => { 
          if(resp.ok ){
            localStorage.setItem('token', resp.token!);
        
          }
        }),
        map( resp => resp.ok ), //devuelve true si login correcto
        catchError (err => of(err.error.msg)) //of para cast to boolean to observable,devuelve false mal login
      );             
  }

  registro( name: string, email: string, password: string){
    const url = `${this.baseUrl}/auth/new`;
    const body = {email, password, name};

    return this.http.post<AuthResponse>(url, body)
    .pipe(
      tap( resp => { 
        if(resp.ok ){

          //no devuelve token, envia un correo para confirmar la cuenta
          //localStorage.setItem('token', resp.token!);
      
        }
      }),
      map( resp => resp.ok ), //devuelve true si login correcto
      catchError (err => of(err.error.msg)) //of para cast to boolean to observable,devuelve false mal login
    );
  }

  validarToken(): Observable<boolean>{

    const url = `${this.baseUrl}/auth/renew`;

    if(!localStorage.getItem('token') && localStorage.getItem('token-google')){
      
    }
  
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

  
    return this.http.get<AuthResponse>( url, { headers })
      .pipe(
        map( resp => {
          
            localStorage.setItem('token', resp.token! );
            this._auth = {
              id: resp.id!,
              uid: resp.uid!,
              name: resp.name!,
              email: resp.email!
            }
            //console.log(this._auth)
            return resp.ok;

        }),
        catchError( err => of(false))
      );
  }

  validarTokenAdmin(): Observable<boolean>{

    const url = `${this.baseUrl}/auth/renewadmin`;
    
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    
    
    return this.http.get<AuthResponse>( url, { headers })
      .pipe(
        map( resp => {
          
            localStorage.setItem('token', resp.token! );
            this._auth = {
              id: resp.id!,
              uid: resp.uid!,
              name: resp.name!,
              email: resp.email!
            }
            return resp.ok;

        }),
        catchError( err => of(false))
      );
  }

  login( email: string, password: string){

    const url = `${this.baseUrl}/auth`;
    const body = {email, password};

    return this.http.post<AuthResponse>(url, body)
    .pipe(
      tap( resp => { 
        if(resp.ok ){
          localStorage.setItem('token', resp.token!);
      
        }
      }),
      map( resp => resp.ok ), //devuelve true si login correcto
      catchError (err => of(err)) //of para cast to boolean to observable,devuelve false mal login
    );
    
  }


 

  login_admin( email: string, password: string){

    const url = `${this.baseUrl}/auth/admin`;
    console.log("weaaa")
    const body = {email, password};

    return this.http.post<AuthResponse>(url, body)
    .pipe(
      tap( resp => { 
        if(resp.ok ){
          localStorage.setItem('token', resp.token!);
      
        }
      }),
      map( resp => resp.ok ), //devuelve true si login correcto
      catchError (err => of(err.error.msg)) //of para cast to boolean to observable,devuelve false mal login
    );
    
  }

  logout() {
    localStorage.clear();
    this.pedidoService.cart = [];
    this.sharedService.Setpage_back = 0;
    this.sharedService.SetproductoId = 0;
    this.sharedService.SetproductoId_back = -1;
    this._auth = undefined;
  }
}