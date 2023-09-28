import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DropLocation } from '../../interfaces/pointups.interface';
import { NuevoPedidoComponent } from '../../pages/nuevo-pedido/nuevo-pedido.component';

@Component({
  selector: 'app-texto-apoint',
  templateUrl: './texto-apoint.component.html',
  styleUrls: ['./texto-apoint.component.css']
})
export class TextoApointComponent implements OnInit {


  punto_acceso!: DropLocation;

  horario: string[] = [];

  constructor(public dialogRef: MatDialogRef<NuevoPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  

  ngOnInit(): void {

    this.punto_acceso = this.data.data;

    this.horario = this.punto_acceso.StandardHoursOfOperation.text.split(';')


    console.log(this.punto_acceso.StandardHoursOfOperation.text)
  }

}
