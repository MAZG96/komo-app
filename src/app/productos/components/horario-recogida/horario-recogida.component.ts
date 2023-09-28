import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CuentaComponent } from '../../pages/cuenta/cuenta.component';
import { InfoUsuarioService } from '../../services/info-usuario.service';

@Component({
  selector: 'app-horario-recogida',
  templateUrl: './horario-recogida.component.html',
  styleUrls: ['./horario-recogida.component.css']
})
export class HorarioRecogidaComponent implements OnInit {

  constructor(private infoUsuarioService: InfoUsuarioService,
              private authService: AuthService,
              public dialogRef: MatDialogRef<CuentaComponent>) { }


  horario: string[] = [];

  horario_lunes!: string;
  horario_martes!: string;
  horario_miercoles!: string;
  horario_jueves!: string;
  horario_viernes!: string;
  horario_sabado!: string;
  horario_domingo!: string;

  horario_cargado : boolean = false;


  


  get usuario() {
    return this.authService.auth;
  }


  ngOnInit(): void {

    this.infoUsuarioService.getInfoUsuario(this.usuario.id)
      .subscribe(usuario => {

        if(usuario){
          
        if(usuario.horario){
          this.get_horario(usuario.horario);
        }else{
          this.horario_cargado = true;
        }

        }else{
          this.horario_cargado = true;
        }
      })
  }

  get_horario(horario :string){

    //Lunes 10:10-11:11.21:10-22:22,Viernes 12:12-12:15.12:21-12:31

    let horario_array = horario.split(',');

    //Lunes 10:10-11:11.21:10-22:22
    for(let dia of horario_array){
      if(dia.includes("Lunes")){
        this.horario_lunes = dia;
        this.horario[0] = dia;
      }else if(dia.includes("Martes")){
        this.horario_martes = dia;
        this.horario[1] = dia;
      }else if(dia.includes("Miercoles")){
        this.horario_miercoles = dia;
        this.horario[2] = dia;
      }else if(dia.includes("Jueves")){
        this.horario_jueves = dia;
        this.horario[3] = dia;
      }else if(dia.includes("Viernes")){
        this.horario_viernes = dia;
        this.horario[4] = dia;
      }else if(dia.includes("Sabado")){
        this.horario_sabado = dia;
        this.horario[5] = dia;
      }else if(dia.includes("Domingo")){
        this.horario_domingo = dia;
        this.horario[6] = dia;
      }
    }

    this.horario_cargado = true;

  }

  cerrar(){
    this.dialogRef.close();

  }

  add_horario(){
    this.infoUsuarioService.getInfoUsuario(this.usuario.id).pipe(
      switchMap(usuario =>{
        usuario.horario = this.horario.toString().split(',').filter(el => el).toString();
        return this.infoUsuarioService.actualizarInfoUsuario(usuario).pipe()
      }
        )
    )
    .subscribe(usuario =>
      {
        localStorage.setItem("horario", this.horario.toString());
        console.log("horario añadido");
      })
  }

  lunes(miVar:string){
    this.horario[0] = miVar;
    console.log(this.horario)
    this.add_horario();
  }

  martes(miVar:string){
    this.horario[1] = miVar;
    this.add_horario();

  }

  miercoles(miVar:string){
    this.horario[2] = miVar;
    console.log(this.horario)
    this.add_horario();
  }

  jueves(miVar:string){
    this.horario[3] = miVar;
    this.add_horario();
  }

  viernes(miVar:string){
    this.horario[4] = miVar;
    this.add_horario();
  }

  sabado(miVar:string){
    this.horario[5] = miVar;
    this.add_horario();
  }

  domingo(miVar:string){
    this.horario[6] = miVar;
    this.add_horario();
  }


}
