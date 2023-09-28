import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CuentaComponent } from '../../pages/cuenta/cuenta.component';

@Component({
  selector: 'app-elegir-horas',
  templateUrl: './elegir-horas.component.html',
  styleUrls: ['./elegir-horas.component.css']
})
export class ElegirHorasComponent implements OnInit {

  @Input() dia_semana="";

  @Output() outputEmiter = new EventEmitter<string>();

  @Input() horario!: string;

  horario2:boolean = false;

  horas: string[] = [];

  hora_apertura_m: string = "";
  hora_apertura_t: string = "";
  hora_cierre_m: string = "";
  hora_cierre_t: string = "";

  constructor(private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CuentaComponent>) { }


  me():void{
    
  }

  ngOnInit(): void {

    console.log(this.horario)

    if(this.horario){

      let horario_dividido = this.horario.split(' ')
      console.log(horario_dividido)
      this.dia_semana = horario_dividido[0] //Lunes

      console.log(this.dia_semana);
      
      this.hora_apertura_m = horario_dividido[1].split(';')[0].split('-')[0]
      this.hora_cierre_m = horario_dividido[1].split(';')[0].split('-')[1]

      console.log(this.hora_apertura_m)
      if(horario_dividido[1].includes('.')){

        this.horario2 = true;

        this.hora_apertura_t = horario_dividido[1].split(';')[1].split('-')[0]
        this.hora_cierre_t = horario_dividido[1].split(';')[1].split('-')[1]
        

      }

    }
    
  }


  guardar(){


    this.horas = []
    if(this.hora_apertura_m.length != 0 && this.hora_cierre_m.length != 0){

      if(!this.before(this.hora_apertura_m,this.hora_cierre_m)){
        this.mostrarSnakbar("Horario de apertura posterior al cierre");
        return;
      }else{
        this.horas.push(this.hora_apertura_m+'-'+this.hora_cierre_m)  ;
        
      }

    }else if(this.hora_apertura_m.length != 0 || this.hora_cierre_m.length != 0){
      this.mostrarSnakbar("Rellena el horario 1");
      return;
    }

    if(this.hora_cierre_m.length != 0 && this.hora_apertura_t.length != 0){
      if(!this.before(this.hora_cierre_m,this.hora_apertura_t)){
        this.mostrarSnakbar("Horario 1 de cierre posterior al de apertura de Horario 2");
        return;
      }
    }


    if(this.hora_apertura_t.length != 0 && this.hora_cierre_t.length != 0){
      if(this.hora_apertura_m.length == 0 || this.hora_cierre_m.length == 0){
        this.mostrarSnakbar("Debe completar el horario 1 primero");
        return;
      }

      if(!this.before(this.hora_apertura_t,this.hora_cierre_t)){
        this.mostrarSnakbar("Horario de apertura posterior al cierre");
        return;
      }else{
        this.horas.push(this.hora_apertura_t+'-'+this.hora_cierre_t)  ;
      }
      
    }else if(this.hora_apertura_t.length != 0 || this.hora_cierre_t.length != 0){
      this.mostrarSnakbar("Rellena el Horario 2");
      return;
    }


    if(this.horas.length > 0){
      this.outputEmiter.emit(this.dia_semana+" "+this.horas.toString().replace(',',';'));
    }else{
      this.outputEmiter.emit('');

    }

    this.mostrarSnakbar("Horario del "+this.dia_semana+" guardado");

    

  }


  


  before(hora_apertura: string, hora_cierre: string) :boolean{
    if(hora_apertura.split(':')[0] < hora_cierre.split(':')[0]){ //comprueba hora

      return true;

    } else if(hora_apertura.split(':')[0] == hora_cierre.split(':')[0]){
      if(hora_apertura.split(':')[1] < hora_cierre.split(':')[1]){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  remove_horario2(){
    this.horario2 = false;
    this.hora_cierre_t = "";

    this.hora_apertura_t = "";

  }


  add_horario2(){
    this.horario2 = true;

  }

  cerrar(){
    
    this.dialogRef.close();

  }

  mostrarSnakbar( mensaje: string ) {

    this.snackBar.open( mensaje, 'ok!', {
      duration: 2500
    });

  }

}
