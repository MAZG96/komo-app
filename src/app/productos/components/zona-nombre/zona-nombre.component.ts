import { Component, Input, OnInit } from '@angular/core';
import { ZonaService } from 'src/app/backoffice/services/zona.service';
import { Zona } from '../../interfaces/zona.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-zona-nombre',
  templateUrl: './zona-nombre.component.html',
  styleUrls: ['./zona-nombre.component.css']
})
export class ZonaNombreComponent implements OnInit {

  @Input() id_zona!: number;

  zona!: Zona;

  info!: Usuario;

  constructor(private zonaService: ZonaService,
              private sharedService: SharedService,
              private infousuarioService: InfoUsuarioService) { }

  ngOnInit(): void {


    console.log(this.id_zona)
    if(this.sharedService.Gettipo_venta == 1){

      this.zonaService.getZona(this.id_zona)
      .subscribe(zona=> {

        this.zona = zona})

    }else{
      
      this.infousuarioService.getInfoUsuario(this.id_zona)
      .subscribe( info => this.info = info)

    }


  }

}
