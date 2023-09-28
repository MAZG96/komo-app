import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PedidoComponent } from 'src/app/backoffice/pages/pedido/pedido.component';
import { SharedService } from 'src/app/services/shared.service';
import { Pedido } from '../../interfaces/pedidos.interface';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-fin-pedido',
  templateUrl: './fin-pedido.component.html',
  styleUrls: ['./fin-pedido.component.css']
})
export class FinPedidoComponent implements OnInit {

  pedido !: Pedido;

  constructor(private sharedService: SharedService,
              private pedidoService: PedidosService,
              private route: ActivatedRoute,
              ) { }

  ngOnInit(): void {

    this.route.paramMap.pipe(
      switchMap(params => {
        let id = this.pedidoService.decryptData(params.get("id")).split('komo')[1];

        return this.pedidoService.getPedidoPorId(id)
      }))
      .subscribe(pedido => {
        this.pedido = pedido;
        this.sharedService.SetproductoId = Number(pedido.id);
      })

  }


}
