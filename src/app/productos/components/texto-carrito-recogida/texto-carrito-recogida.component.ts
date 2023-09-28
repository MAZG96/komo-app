import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DatosPedidoComponent } from '../../pages/datos-pedido/datos-pedido.component';

@Component({
  selector: 'app-texto-carrito-recogida',
  templateUrl: './texto-carrito-recogida.component.html',
  styleUrls: ['./texto-carrito-recogida.component.css']
})
export class TextoCarritoRecogidaComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DatosPedidoComponent>,
    ) { }

  ngOnInit(): void {
  }

  elegir_fecha(){
    this.dialogRef.close({event:'elegir'});
  }

  eliminar_productos(){
    this.dialogRef.close({event:'eliminar'});
  }

}
