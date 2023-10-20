import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ZonaService } from 'src/app/backoffice/services/zona.service';
import { Categoria } from '../../interfaces/categoria.interfaces';
import { Zona } from '../../interfaces/zona.interface';
import { BuscarComponent } from '../../pages/buscar/buscar.component';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-elegirzona',
  templateUrl: './elegirzona.component.html',
  styleUrls: ['./elegirzona.component.css']
})
export class ElegirzonaComponent implements OnInit {

    
    
  zona: Zona = {
    id: 0,
    nombre: '',
    cp_inicio: '',
    direccion: '',
    horario: '',
    provincia: '',
    cp_fin: ''
  };
  
  codigo_postal:string = "";
  comprobado_cp:boolean = false;

  constructor(private productosService: ProductosService,
    public dialogRef: MatDialogRef<BuscarComponent>,
    private zonaService: ZonaService) { }

  ngOnInit(): void {
    if(localStorage.getItem("zona_busqueda")){
      this.zona = JSON.parse(localStorage.getItem("zona_busqueda")!);
    }

  }

  recargar_zonas(){
    

  }


  comprobar_cp(){

    if(Number(this.codigo_postal) < 999 || Number(this.codigo_postal) > 53000){
      this.comprobado_cp = false;
      this.zona = {
        id: 0,
        nombre: '',
        cp_inicio: '',
        direccion: '',
        horario: '',
        provincia: '',
        cp_fin: ''
      };

    }else{
      this.comprobado_cp = true;
      this.elegir_zona();
    }
  }

  elegir_zona(){

    this.zonaService.getZonaCP(this.codigo_postal)
      .subscribe(zona => {
        if(zona){
          this.zona = zona
          console.log("hola")
        }
      })
  }

  seleccionar_zona(){

    this.zonaService.getZonaCP(this.codigo_postal)
      .subscribe(zona => {
        if(zona){
          this.zona = zona;
        }
      })

    localStorage.setItem("zona_busqueda", JSON.stringify(this.zona))
    this.salir();
  }



  salir(){
    this.dialogRef.close();

  }
}
