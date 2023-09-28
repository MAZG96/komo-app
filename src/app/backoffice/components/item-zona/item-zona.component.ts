import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { HorarioRecogidaComponent } from 'src/app/productos/components/horario-recogida/horario-recogida.component';
import { Comentario } from 'src/app/productos/interfaces/comentario.interface';
import { Producto } from 'src/app/productos/interfaces/productos.interface';
import { Usuario } from 'src/app/productos/interfaces/usuario.interface';
import { Zona } from 'src/app/productos/interfaces/zona.interface';
import { InfoUsuarioService } from 'src/app/productos/services/info-usuario.service';
import { ProductosService } from 'src/app/productos/services/productos.service';
import { ZonaService } from '../../services/zona.service';
import { HorarioComponent } from '../horario/horario.component';

@Component({
  selector: 'app-item-zona',
  templateUrl: './item-zona.component.html',
  styleUrls: ['./item-zona.component.css']
})
export class ItemZonaComponent implements OnInit {


  @Input() item!: Zona;

  horario: string[] = [];


  provincias: string[] = ['Alava','Albacete','Alicante','Almería','Asturias','Avila','Badajoz','Barcelona','Burgos','Cáceres',
  'Cádiz','Cantabria','Castellón','Ciudad Real','Córdoba','La Coruña','Cuenca','Gerona','Granada','Guadalajara',
  'Guipúzcoa','Huelva','Huesca','Mallorca','Menorca','Ibiza','Jaén','León','Lérida','Lugo','Madrid','Málaga','Murcia','Navarra',
  'Orense','Palencia','Las Palmas','Pontevedra','La Rioja','Salamanca','Santander','Segovia','Sevilla','Soria','Tarragona',
  'Santa Cruz de Tenerife','Teruel','Toledo','Valencia','Valladolid','Vizcaya','Zamora','Zaragoza']

  estado:string = "";
  calle: string = "";
  localidad: string = "";



  constructor(private zonaService:ZonaService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    if(this.item.horario != ""){
      this.horario = this.item.horario.split(',')
    }

    if(this.item.direccion){
      let direccion = this.item.direccion!.split(',')

      this.calle = direccion[0].toString();
      this.localidad = direccion[1].toString();
    }
  }
   

  update_zona(){
    
    this.item.horario = this.horario.toString();

    this.item.direccion = this.calle+","+this.localidad;
    
    this.zonaService.actualizarZona(this.item)
      .subscribe(zona => {
        this.mostrarSnakbar("¡Zona actualizada!")
      })
  }

  borrar_zona(){
    
    this.zonaService.borrarZona(this.item.id)
      .subscribe(zona =>{
        this.mostrarSnakbar("Zona Eliminada")
        window.location.reload();

      })
  }

  mostrarSnakbar( mensaje: string ) {

    this.snackBar.open( mensaje, 'ok!', {
      duration: 2500
    });

  }


  DialogHorarios(): void {
    const dialogRef = this.dialog.open(HorarioComponent, {
      maxHeight: 'calc(100% - 32px)',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'full-screen-modal',
      data: {horario: this.horario, zona: this.item},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(localStorage.getItem("horario")){
        
        this.horario = localStorage.getItem("horario")!.split(',');
        localStorage.removeItem("horario");       
        this.item.horario = this.horario.toString();
      }


      }
      
      
    );
  }

}
