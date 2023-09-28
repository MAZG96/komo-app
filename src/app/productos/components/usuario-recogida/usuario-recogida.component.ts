import { Component, Input, OnInit } from '@angular/core';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-usuario-recogida',
  templateUrl: './usuario-recogida.component.html',
  styleUrls: ['./usuario-recogida.component.css']
})
export class UsuarioRecogidaComponent implements OnInit {

  @Input() id_usuario!: number;

  usuario!: Usuario;

  dias_semana!: string;

  horas: string[] = [];

  horario_elegido: string = "";

  cart!: ItemCarrito[];




  constructor(private infoUsuario: InfoUsuarioService,
              private sharedService: SharedService) { }

  ngOnInit(): void {


    this.cart = this.sharedService.Getcarro_compra;

  
    for(let item of this.cart){

      if(item.id_productor == this.id_usuario){
        if(item.recogida != 'envio'){ // metodo elegido recogida
          this.horario_elegido = item.recogida!;
        }
      }
      
    }


    if(this.id_usuario){

      this.infoUsuario.getInfoUsuario(this.id_usuario)
        .subscribe(usuario => {
          this.usuario = usuario;

          let horarios = usuario.horario!.split(',');

        for(let item of horarios){
          this.dias_semana = item.split(' ')[0].toString(); //Lunes
          let horas_dia = item.split(' ')[1].split(';');
          for(let it of horas_dia){
            this.horas.push(this.dias_semana+" "+it); //13:30-12:00            
          }
        }
        })
        
    }
  }


  asignar_metodo_recogida(){

    this.cart = this.sharedService.Getcarro_compra;

    for(let item of this.sharedService.Getcarro_compra){

      if(item.id_productor == this.id_usuario){
        item.recogida = this.horario_elegido;
        let index = this.sharedService.Getcarro_compra.indexOf(item)
        this.sharedService.Getcarro_compra[index] = item;
      }
      

    }


  }
}
