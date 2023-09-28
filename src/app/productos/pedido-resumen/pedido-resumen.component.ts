import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { ItemCarrito } from '../interfaces/carrito.interface';
import { Pedido } from '../interfaces/pedidos.interface';
import { PedidosService } from '../services/pedidos.service';

@Component({
  selector: 'app-pedido-resumen',
  templateUrl: './pedido-resumen.component.html',
  styleUrls: ['./pedido-resumen.component.css']
})
export class PedidoResumenComponent implements OnInit {

  item_pedidos!: ItemCarrito[];

  cargado: boolean = false;
  pedido!: Pedido;

  indices!: number[];


  indices_copia: number[] = [];

  constructor(private pedidosService: PedidosService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService) { }


    get usuario(){
      return this.authService.auth
    }

  ngOnInit(): void {

      
    if(this.sharedService.GetproductoId != 0){
      this.pedidosService.getPedidoPorId(this.sharedService.GetproductoId).pipe(
        switchMap(pedido => {
          if(pedido){
            this.pedido = pedido;
          }else{
            this.router.navigate(['/productos/cuenta']);
          }
          
          return this.pedidosService.getItemPedidos(Number(pedido.id)).pipe()
        })
      ).subscribe(item_pedidos =>
        {
            
  
          this.item_pedidos = item_pedidos;
          this.cargado = true;
   
        })
    }else{
      this.activatedRoute.params.pipe(
        switchMap( ({ id }) => this.pedidosService.getPedidoPorId(id).pipe(
          switchMap(pedido => 
            {
              
              if((this.usuario.id == pedido.id_usuario) && pedido){
                this.pedido = pedido;
              }else{
                this.router.navigate(['/productos/cuenta']);
              }
              
              return this.pedidosService.getItemPedidos(Number(pedido.id)).pipe()
            })
        )
      )
      ).subscribe(item_pedidos =>
        {
            

          this.item_pedidos = item_pedidos;
          this.cargado = true;
   
        });

      

      this.sharedService.SetproductoId_back = 1;
    }
    

        
        

    
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
