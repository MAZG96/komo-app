import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxXmlToJsonService } from 'ngx-xml-to-json';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocatorResponse } from '../interfaces/location.interface';
import { LabelRecoveryResponse, PedidoUPS, RespuestaEtiquetaUPS } from '../interfaces/pedidoups.interface';
import { PrecioUPS } from '../interfaces/precioups.interface';
import { RespuestaPedidoUPS } from '../interfaces/respuestapedidoups.interface';
import { Pedido } from '../interfaces/pedidos.interface';

@Injectable({
  providedIn: 'root'
})
export class UPSService {

  private baseUrl: string = environment.baseUrl;

  options = { // set up the default options 
    textKey: 'text', // tag name for text nodes
    attrKey: 'attr', // tag for attr groups
    cdataKey: 'cdata', // tag for cdata nodes (ignored if mergeCDATA is true)
  };

  constructor(private http: HttpClient,private ngxXmlToJsonService: NgxXmlToJsonService) { }

  access_point(codigo_postal: string): Observable<any>{

    let body = { 
      codigo_postal: codigo_postal
    }

    let headers = new HttpHeaders();
          headers = headers.append('Content-Type', 'text/xml');
          headers = headers.append('Accept', 'text/xml');
 
    
    return  this.http.post<Observable<any>>(`${ this.baseUrl }/ups`,body);
  }

  calcular_tarifa(precioUPS: PrecioUPS): Observable<any>{

    let body = {
      precioUPS
    }
    
    return  this.http.post<Observable<any>>(`${ this.baseUrl }/ups/rate`,body);
  }

  calcular_tarifaMBE(itemMBE: String[], pedido: Pedido): Observable<any>{

    let body = {

      cuerpo: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://www.onlinembe.eu/ws/">
      <soapenv:Header/>
      <soapenv:Body>
         <ws:ShippingOptionsRequest>
            <RequestContainer>
               <System>ES</System>
               <InternalReferenceID>TEST opciones de envio</InternalReferenceID>
               <ShippingParameters>
                   <DestinationInfo>
                       <ZipCode>`+pedido.codigo_postal+`</ZipCode>
                       <City>barcelona</City>
                       <State></State>
                       <Country>ES</Country>
                  </DestinationInfo>
                  <ShipType>EXPORT</ShipType>
                  <PackageType>GENERIC</PackageType>
                  <Items>`+itemMBE.toString()+`</Items>
               </ShippingParameters>
            </RequestContainer>
         </ws:ShippingOptionsRequest>
      </soapenv:Body>
   </soapenv:Envelope>`
   
    }
    
    return  this.http.post<Observable<any>>(`${ this.baseUrl }/ups/rateMBE`,body);
  }



  generar_etiqueta(codigo_ups: string): Observable<RespuestaEtiquetaUPS>{

    let body = {
      codigo_ups: codigo_ups
    }
    
    return  this.http.post<RespuestaEtiquetaUPS>(`${ this.baseUrl }/ups/label`,body);
  }



  crear_envio(pedidoUPS: PedidoUPS): Observable<RespuestaPedidoUPS>{

    let body = {
      pedidoUPS
    }

    
    
    return  this.http.post<RespuestaPedidoUPS>(`${ this.baseUrl }/ups/ship`,body);
  }

  XMLTOJSON(xml: string){

    const options = { // set up the default options 
      textKey: 'text', // tag name for text nodes
      attrKey: 'attr', // tag for attr groups
      cdataKey: 'cdata', // tag for cdata nodes (ignored if mergeCDATA is true)
    };

    return this.ngxXmlToJsonService.xmlToJson(xml, options)

  }




}
