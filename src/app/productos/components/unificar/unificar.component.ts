import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ZonaService } from 'src/app/backoffice/services/zona.service';
import { Zona } from '../../interfaces/zona.interface';
import { ListadoComponent } from '../../pages/listado/listado.component';

@Component({
  selector: 'app-unificar',
  templateUrl: './unificar.component.html',
  styleUrls: ['./unificar.component.css']
})
export class UnificarComponent implements OnInit {

  prov: string  = "";

  provincias: string[] = ['Alava','Albacete','Alicante','Almería','Asturias','Avila','Badajoz','Barcelona','Burgos','Cáceres',
  'Cádiz','Cantabria','Castellón','Ciudad Real','Córdoba','La Coruña','Cuenca','Gerona','Granada','Guadalajara',
  'Guipúzcoa','Huelva','Huesca','Islas Baleares','Jaén','León','Lérida','Lugo','Madrid','Málaga','Murcia','Navarra',
  'Orense','Palencia','Las Palmas','Pontevedra','La Rioja','Salamanca','Segovia','Sevilla','Soria','Tarragona',
  'Santa Cruz de Tenerife','Teruel','Toledo','Valencia','Valladolid','Vizcaya','Zamora','Zaragoza']

  zonas: Zona[] = [];

  zona: Zona = {
    id: 0,
    nombre: '',
    cp_inicio: '',
    direccion: '',
    horario: '',
    provincia: '',
    cp_fin: ''
  };

  constructor(private zonaService: ZonaService,
    public dialogRef: MatDialogRef<ListadoComponent>,) { }

  ngOnInit(): void {
  }

  recargar_zonas(){

    this.zona = {
      id: 0,
      nombre: '',
      cp_inicio: '',
      direccion: '',
      horario: '',
      provincia: '',
      cp_fin: ''
    };
    
    this.zonaService.getZonasProvincia(this.prov)
      .subscribe(zonas=> {
          this.zonas = zonas
        })
  }


  elegir_zona(){

    this.zonaService.getZona(this.zona.id)
      .subscribe(zona =>
        {
          this.zona = zona;
          localStorage.setItem("zona", JSON.stringify(this.zona));

        }
        
        )

    this.dialogRef.close();

  }

  get_zona(){
    this.zonaService.getZona(this.zona.id)
      .subscribe(zona=> {
          if(zona){
            this.zona = zona;
            console.log(zona)
            localStorage.setItem("zona", JSON.stringify(this.zona));
          }
        })
  }

  salir(){
    this.dialogRef.close();

  }
}
