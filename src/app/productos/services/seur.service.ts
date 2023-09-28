import { Injectable } from '@angular/core';
import { ZonaService } from 'src/app/backoffice/services/zona.service';

@Injectable({
  providedIn: 'root'
})
export class SeurService {

  provincias_norte: string[] = ['Alava','Asturias','Avila','Barcelona','Burgos','Cantabria','La Coruña','Gerona','Guadalajara','Guipúzcoa','Huesca','León','Lérida','Lugo','Madrid','Navarra',
  'Orense','Palencia','Pontevedra','La Rioja','Salamanca','Santander','Segovia','Soria','Tarragona','Teruel','Valladolid','Vizcaya','Zamora','Zaragoza'];

  provincias_baleares : string[] = ['Mallorca','Menorca','Ibiza'];

  provincias_canarias : string[] = ['Santa Cruz de Tenerife','Las Palmas'];

  provincias_sur: string[] = ['Albacete','Alicante','Almería','Badajoz','Cáceres','Cádiz','Castellón','Ciudad Real','Córdoba','Cuenca','Granada','Huelva','Jaén','Málaga','Murcia','Sevilla','Toledo','Valencia'];

  constructor(private zonaService: ZonaService) { }

  calcular_envio_frio(cp_origen: string, cp_destino: string){

  }
}
