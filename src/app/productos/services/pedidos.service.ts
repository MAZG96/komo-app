import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ItemCarrito } from '../interfaces/carrito.interface';
import { Dato } from '../interfaces/dato.interface';
import { Pedido } from '../interfaces/pedidos.interface';
import { ProductosService } from './productos.service';
import CryptoJS from 'crypto-js';



@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private baseUrl: string = environment.baseUrl;
  
  meses: string[] = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

  cart : ItemCarrito[] = JSON.parse(localStorage.getItem("cart")!) || [];
  
  total!: number;
  
  encryptSecretKey: string = "clavesecreta"
  
  encryptData(data: any) {

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    } catch (e) {
      return (e)
    }
  }

  decryptData(data: any) {

    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }
 

  constructor( private http: HttpClient,private productoServixe: ProductosService ) { }

  carrito_numero_productos(): number{
    let n = 0
    for (let item of this.cart){
      n += item.cantidad;
    }

    return n;
  }


  calcular_precio_envio(peso_total:number): number{

    let tarifa_normal = [
      {
        kg: 1,
        precio: 3.78
      },
      {
        kg: 2,
        precio: 4.05
      },
      {
        kg: 3,
        precio: 4.32
      },
      {
        kg: 4,
        precio: 4.59
      },
      {
        kg: 5,
        precio: 4.86
      },
      {
        kg: 6,
        precio: 5.31
      },
      {
        kg: 7,
        precio: 5.78
      },
      {
        kg: 8,
        precio: 6.29
      },
      {
        kg: 9,
        precio: 6.91
      },
      {
        kg: 10,
        precio: 7.72
      },
      {
        kg: 15,
        precio: 9.53
      },
      {
        kg: 20,
        precio: 12.19
      },
      {
        kg: 25,
        precio: 15.68
      },
      {
        kg: 30,
        precio: 18.71
      }
    ]

    

    for(let i of tarifa_normal){

      if(peso_total < i.kg){
        return i.precio;
      }
    }

    if(peso_total > 30){

      return tarifa_normal[tarifa_normal.length - 1].precio + ((peso_total - 30) * 0.5)

    }
    

    return 0;

  }


  calcular_precio_envio_frio(peso_total:number): number{

    let tarifa_normal = [
      {
        kg: 1,
        precio: 5.59
      },
      {
        kg: 2,
        precio: 7.36
      },
      {
        kg: 3,
        precio: 8.32
      },
      {
        kg: 4,
        precio: 9.75
      },
      {
        kg: 5,
        precio: 10.44
      },
      {
        kg: 6,
        precio: 11.51
      },
      {
        kg: 7,
        precio: 12.02
      },
      {
        kg: 8,
        precio: 12.74
      },
      {
        kg: 9,
        precio: 14.32
      },
      {
        kg: 10,
        precio: 15.07
      },
      {
        kg: 15,
        precio: 23.01
      },
      {
        kg: 20,
        precio: 28.02
      },
      {
        kg: 25,
        precio: 33.11
      },
      {
        kg: 30,
        precio: 38.19
      }
    ]

    

    for(let i of tarifa_normal){

      if(peso_total < i.kg){
        return i.precio;
      }
    }

    if(peso_total > 30){

      return tarifa_normal[tarifa_normal.length - 1].precio + ((peso_total - 30) * 1.09)

    }
    

    return 0;

  }
  calcularPrecioTotal(): number{
    this.total = 0;

    for (let item of this.cart){

      this.productoServixe.getProductoPorId(item.id_producto)
        .subscribe(producto => {
            item.precio = producto.precio;
        })
      
      if((item.estado != "No Disponible" && item.estado != "No Stock") && item.pago_recogida == 0 && item.recogida == "envio" ){
        this.total = this.total + (item.precio * item.cantidad);
      }
      if((item.estado != "No Disponible" && item.estado != "No Stock") && item.recogida != "envio" ){ //COMISION

        let precio_recogida = (item.precio * item.cantidad)
        this.total = this.total + precio_recogida;
      }
      
    }
    return this.total;
  }
  

  total_peso = 0;

  calcularPesoTotal(): number{
    
    for (let item of this.cart){
      if((item.estado != "No Disponible" && item.estado != "No Stock") && item.pago_recogida == 0 ){
        
        this.productoServixe.getProductoPorId(item.id_producto)
          .subscribe(producto => {
            this.total_peso = this.total_peso + producto.peso_total;
          })
      }
    }


    return this.total_peso;
  }

  get total_carro(){
    return this.total;
  }


  getPedidos(): Observable<Pedido[]> {   
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    return this.http.get<Pedido[]>(`${ this.baseUrl }/pedidos`, {headers});    
  }

  getPedidoPorId( id: number ):Observable<Pedido> {
    return this.http.get<Pedido>(`${ this.baseUrl }/pedidos/${ id }`);
  }

  getPedidosPorUsuario( id_usuario: number):Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${ this.baseUrl }/pedidos/usuario/${ id_usuario }`);
  }

  agregarPedido( pedido: Pedido ): Observable<Pedido > {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');
    
    return this.http.post<Pedido>(`${ this.baseUrl }/pedidos`, pedido,{headers});
  }

  updatePedido( pedido: Pedido ): Observable<Pedido > {
    return this.http.put<Pedido>(`${ this.baseUrl }/pedidos/${ pedido.id }`, pedido);
  }

  notificarPedido( pedido: Pedido ): Observable<Pedido > {
    return this.http.post<Pedido>(`${ this.baseUrl }/pedidos/send`, pedido,);
  }

  notificarPedidoAdmin( pedido: Pedido ): Observable<Pedido > {
    return this.http.post<Pedido>(`${ this.baseUrl }/pedidos/send_admin`, pedido,);
  }


  notificarVenta( itempedido: ItemCarrito): Observable<ItemCarrito > {
    return this.http.post<ItemCarrito>(`${ this.baseUrl }/pedidos/sendventa`, itempedido,);
  }

  //Información guardada para futuras compras
  agregarInfoPedido( Pedido: Pedido ): Observable<Pedido > {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');
    
    return this.http.post<Pedido>(`${ this.baseUrl }/info-pedidos`, Pedido,{headers});
  }

  updateInfoPedido( Pedido: Pedido ): Observable<Pedido > {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');
    
    return this.http.put<Pedido>(`${ this.baseUrl }/info-pedidos/${ Pedido.id }`, Pedido,{headers});
  }

  getInfoPedidosPorUsuario( id_usuario: number):Observable<Pedido> {
    return this.http.get<Pedido>(`${ this.baseUrl }/info-pedidos/${ id_usuario }`);
  }

  agregarItemPedido( cart: ItemCarrito[]): Observable<ItemCarrito[] > {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '')
    .set('Content-Type', 'application/json; charset=utf-8')
    
    return this.http.post<ItemCarrito[]>(`${ this.baseUrl }/item-pedidos`, JSON.stringify(cart),{headers});
  }

  updateItemPedido( itemPedido: ItemCarrito ): Observable<Pedido > {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    
    return this.http.put<Pedido>(`${ this.baseUrl }/item-pedidos/`, itemPedido,{headers});
  }

  NotificarPedido( pedido: Pedido): Observable<ItemCarrito[] > {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '')
    .set('Content-Type', 'application/json; charset=utf-8')

    
    return this.http.post<ItemCarrito[]>(`${ this.baseUrl }/pedidos/send`, pedido,{headers});
  }

  getDatosGrafica(): Observable<Dato[]> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '')

    return this.http.get<Dato[]>(`${ this.baseUrl }/pedidos/grafica/1`, {headers});
  }

  getDatosGraficaDonaData() {
    return this.getDatosGrafica()
      .pipe(
        map( data => {
          
          return  data;
        })
      )
  }

  getItemPedidosAll(): Observable<ItemCarrito[]> {
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '')

    return this.http.get<ItemCarrito[]>(`${ this.baseUrl }/item-pedidos/`);
  }

  getItemPedidosVendidos( id_productor: number):Observable<ItemCarrito[] > {
    return this.http.get<ItemCarrito[]>(`${ this.baseUrl }/item-pedidos/productor/${ id_productor }`);
  }


  getItemPedidos( id_pedido: number):Observable<ItemCarrito[] > {
    return this.http.get<ItemCarrito[]>(`${ this.baseUrl }/item-pedidos/${ id_pedido }`);
  }


  groupBy<ItemCarrito>(collection:ItemCarrito[],key: keyof ItemCarrito){
    const groupedResult =  collection.reduce((previous,current)=>{
 
    if(!previous[current[key]]){
      previous[current[key]] = [] as ItemCarrito[];
     }
 
    previous[current[key]].push(current);
           return previous;
    },{} as any); // tried to figure this out, help!!!!!
      return groupedResult
  }

  agregarPedidoSEUR( cart: ItemCarrito): Observable<ItemCarrito > {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json; charset=utf-8')
    console.log(cart);
    
    return this.http.post<ItemCarrito>(`${ this.baseUrl }/item-pedidos/seur`, JSON.stringify(cart),{headers});
  }
  

}
