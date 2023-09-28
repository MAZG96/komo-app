import { Component, OnInit } from '@angular/core';
import { Zona } from 'src/app/productos/interfaces/zona.interface';
import { ZonaService } from '../../services/zona.service';

@Component({
  selector: 'app-zona',
  templateUrl: './zona.component.html',
  styleUrls: ['./zona.component.css']
})
export class ZonaComponent implements OnInit {

  zonas!: Zona[];

  constructor(private zonaService: ZonaService) { }

  ngOnInit(): void {
    this.zonaService.listarZonas()
      .subscribe( zonas => this.zonas = zonas)
  }

  crear_zona(){
    let zona: Zona = {
      id: 0,
      nombre: '',
      horario: '',
      direccion: '',
      cp_inicio: '',
      cp_fin: '',
      provincia: ''
    }

    this.zonaService.agregarZona(zona)
      .subscribe(zona => 
        console.log(zona))

        window.location.reload();

  }
  


}