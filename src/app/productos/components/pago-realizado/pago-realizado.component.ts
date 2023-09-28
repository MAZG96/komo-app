import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PedidoComponent } from 'src/app/backoffice/pages/pedido/pedido.component';

@Component({
  selector: 'app-pago-realizado',
  templateUrl: './pago-realizado.component.html',
  styleUrls: ['./pago-realizado.component.css']
})
export class PagoRealizadoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PagoRealizadoComponent>,) { }

  ngOnInit(): void {
  }

  fin_pedido(){
    this.dialogRef.close();
  }
    

}
