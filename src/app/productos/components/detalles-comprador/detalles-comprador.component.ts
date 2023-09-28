import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pedido } from '../../interfaces/pedidos.interface';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-detalles-comprador',
  templateUrl: './detalles-comprador.component.html',
  styleUrls: ['./detalles-comprador.component.css']
})
export class DetallesCompradorComponent implements OnInit {

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public id_pedido: number,
              private pedidoService: PedidosService) { }

  pedido!: Pedido;

  ngOnInit(): void {
    this.pedidoService.getPedidoPorId(this.id_pedido)
      .subscribe(pedido => {
        console.log(pedido)
        this.pedido = pedido
      })
  }

}
