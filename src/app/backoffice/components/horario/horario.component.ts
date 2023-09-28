import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Zona } from 'src/app/productos/interfaces/zona.interface';
import { ZonaComponent } from '../../pages/zona/zona.component';
import { ZonaService } from '../../services/zona.service';
import { ItemZonaComponent } from '../item-zona/item-zona.component';


@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements OnInit {

  constructor(private zonaService: ZonaService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ItemZonaComponent>) { }


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

this.zonaService.getZona(this.data.zona.id)
.subscribe(zona=> {

if(zona){

if(zona.horario){
this.get_horario(zona.horario);
}
else{
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

console.log(horario_array);

//Lunes 10:10-11:11.21:10-22:22
for(let dia of horario_array){
if(dia.includes("Lunes")){
this.horario_lunes = dia;
this.horario[0] = dia;

console.log(this.horario_lunes)
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
this.zonaService.getZona(this.data.zona.id).pipe(
switchMap(zona =>{
  
zona.horario = this.horario.toString().split(',').filter(el => el).toString();
console.log("Hola: "+zona.horario);
return this.zonaService.actualizarZona(zona).pipe()
}
)
)
.subscribe(zona =>
{
localStorage.setItem("horario", this.horario.toString());
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
