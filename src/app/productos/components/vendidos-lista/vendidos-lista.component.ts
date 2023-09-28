import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-vendidos-lista',
  templateUrl: './vendidos-lista.component.html',
  styleUrls: ['./vendidos-lista.component.css']
})
export class VendidosListaComponent implements OnInit {

  items: ItemCarrito[] = [];

  total_vendido:number = 0;

  items_vendidos!: ItemCarrito[];
  indices_vendidos: number[] = [];

  indices: number[] = [];
  indices_copia: number[] = [];

  cargado: boolean = false;

  constructor(
              private pedidosService: PedidosService,
              private authService: AuthService
              ) { }

  get usuario() {
    return this.authService.auth;
  }

  ngOnInit(): void {



    
    this.pedidosService.getItemPedidosVendidos(this.usuario.id)
      .subscribe(items => {
        this.items_vendidos = this.groupBy(items,'id_pedido');
        
        for(let item of items){
          this.indices_copia.push(item.id_pedido!);
        }

        this.indices = this.indices_copia.filter((item,index)=>{
          return this.indices_copia.indexOf(item) === index;
        })

        for(let i of this.indices){
          this.pedidosService.getPedidoPorId(i)
            .subscribe(pedido => {
              if(pedido.estado == 'Pagado'){
                this.indices_vendidos.push(i);
              }
            })
        }

        console.log(this.indices)
      })

  }


  groupBy<ItemCarrito>(collection:ItemCarrito[],key: keyof ItemCarrito){
    
    const groupedResult =  collection.reduce((previous,current)=>{
 
    if(!previous[current[key]]){
      previous[current[key]] = [] as ItemCarrito[];
     }
 
    previous[current[key]].push(current);
           return previous;
    },{} as any); // tried to figure this out, help!!!!!
      return groupedResult
  }

}
