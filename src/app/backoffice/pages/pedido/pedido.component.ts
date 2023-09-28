import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ItemCarrito } from 'src/app/productos/interfaces/carrito.interface';
import { Pedido } from 'src/app/productos/interfaces/pedidos.interface';
import { PedidosService } from 'src/app/productos/services/pedidos.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  item_pedidos!: ItemCarrito[];

  cargado: boolean = false;
  pedido!: Pedido;

  indices!: number[];


  indices_copia: number[] = [];

  constructor(private pedidosService: PedidosService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private sharedService: SharedService) { }


    get usuario(){
      return this.authService.auth
    }

  ngOnInit(): void {
        
        this.activatedRoute.params.pipe(
          switchMap( ({ id }) => this.pedidosService.getPedidoPorId(id).pipe(
            switchMap(pedido => 
              {
                this.pedido = pedido;
                return this.pedidosService.getItemPedidos(Number(pedido.id)).pipe()
              })
          )
        )
        ).subscribe(item_pedidos =>
          {
              

            if(this.pedido.tipo_venta == 1){ // 1 UNIFICAR

              for(let item of item_pedidos){
                this.indices_copia.push(Number(item.id_ups!));
              }

              
              this.indices = this.indices_copia.filter((item,index)=>{
                return this.indices_copia.indexOf(item) === index;
              })


              this.item_pedidos = this.groupBy(item_pedidos, "id_ups");
            }else{
              for(let item of item_pedidos){
                this.indices_copia.push(Number(item.id_productor!));
              }

              
              this.indices = this.indices_copia.filter((item,index)=>{
                return this.indices_copia.indexOf(item) === index;
              })

              this.item_pedidos = this.groupBy(item_pedidos, "id_productor");
            }
            this.cargado = true;
     
          });

        

        this.sharedService.SetproductoId_back = 1;

    
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
