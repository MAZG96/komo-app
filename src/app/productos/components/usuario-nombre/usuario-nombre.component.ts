import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/usuario.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';

@Component({
  selector: 'app-usuario-nombre',
  templateUrl: './usuario-nombre.component.html',
  styleUrls: ['./usuario-nombre.component.css']
})
export class UsuarioNombreComponent implements OnInit {

  @Input() id_usuario!: number;

  usuario!: Usuario;

  constructor(private infoUsuario: InfoUsuarioService) { }

  ngOnInit(): void {

    if(this.id_usuario){

      this.infoUsuario.getInfoUsuario(this.id_usuario)
        .subscribe(usuario => this.usuario = usuario)
        
    }
  }

}
