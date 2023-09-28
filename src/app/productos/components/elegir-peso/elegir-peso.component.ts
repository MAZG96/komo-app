import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AgregarComponent } from '../../pages/agregar/agregar.component';

export interface Peso_total {
  info: string,
  peso_real: number
}

@Component({
  selector: 'app-elegir-peso',
  templateUrl: './elegir-peso.component.html',
  styleUrls: ['./elegir-peso.component.css']
})



export class ElegirPesoComponent implements OnInit {

  

  favoriteSeason: string = '';
  pesos1: Peso_total[] = [
  {info: "0 - 500g", peso_real: 0.5},
  {info: "500g - 1kg", peso_real: 1},
  {info: "2kg - 3kg", peso_real: 3},
  {info: "3kg - 4kg", peso_real: 4},
  {info: "4kg - 5kg", peso_real: 5},
  {info: "5kg - 6kg", peso_real: 6},
  {info: "6k - 7kg", peso_real: 7},
  {info: "7kg - 8kg", peso_real: 8},
  {info: "8kg - 9kg", peso_real: 9},
  {info: "9kg - 10kg", peso_real: 10}
  ]

  pesos2: Peso_total[] = [
    {info: "10kg - 11kg", peso_real: 11},
    {info: "11kg - 12kg", peso_real: 12},
    {info: "12kg - 13kg", peso_real: 13},
    {info: "13kg - 14kg", peso_real: 14},
    {info: "14kg - 15kg", peso_real: 15},
    {info: "15kg - 16kg", peso_real: 16},
    {info: "16kg - 17kg", peso_real: 17},
    {info: "17kg - 18kg", peso_real: 18},
    {info: "18kg - 19kg", peso_real: 19},
    {info: "19kg - 20kg", peso_real: 20}
    ]


  peso_total: number = 0;


  constructor(public dialogRef: MatDialogRef<AgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,) { }

  ngOnInit(): void {

  }

  asignar_peso(peso: Peso_total){
    this.data = peso.peso_real;

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
