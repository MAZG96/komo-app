import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pedido } from '../interfaces/pedidos.interface';
import { RespuestaStripe } from '../interfaces/stripe.interface';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private baseUrl: string = environment.baseUrl;


  constructor(private http: HttpClient) { }

  charge(cantidad:number, tokenId: string, email:string) :Observable<RespuestaStripe>{

    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json; charset=utf-8')

    let pago = {
      stripeToken: tokenId,
      cantidad: cantidad,
      email: email
    }

    return this.http.post<RespuestaStripe>(`${ this.baseUrl }/stripe_checkout`,pago,{headers});

    //return this.http.post<Producto>(`${ this.baseUrl }/productos`, Producto , {headers});

  }

  pago_boton(pedido: Pedido):Observable<any>{

    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json; charset=utf-8')

    let params = {
      paymentMethodType: 'card',
      currency: 'eur',
      amount: pedido.total
    }

    return this.http.post<any>(`${ this.baseUrl }/create-payment-intent`,params,{headers})


  }


}
