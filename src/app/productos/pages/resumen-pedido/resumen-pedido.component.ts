import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MetodoEnvioComponent } from '../../components/metodo-envio/metodo-envio.component';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-resumen-pedido',
  templateUrl: './resumen-pedido.component.html',
  styleUrls: ['./resumen-pedido.component.css']
})
export class ResumenPedidoComponent implements OnInit {

  cart!: ItemCarrito[];

  carro_ordenado!: ItemCarrito[];
  

  cargado : boolean = false;

  indices: number[] = [];

  usuarios: Usuario[] = [];


  @Input()  recoger_pedido!: boolean;

  


  total: number = 0;


  
  constructor(private pedidoService:PedidosService,
              private productosService: ProductosService,
              public dialog: MatDialog,
              private infoUsuarioService: InfoUsuarioService,
              private router:Router) { }

   async ngOnInit() {

    console.log("PESO TOTAL: "+this.pedidoService.calcularPesoTotal());

    if(this.recoger_pedido == null){
      this.recoger_pedido = true;
    }

    


    this.total = this.pedidoService.calcularPrecioTotal();
    this.cart = JSON.parse(localStorage.getItem("cart")!) || [];

    for(let item of this.cart){
      this.productosService.getProductoPorId(item.id_producto)
        .subscribe(producto => {
          item.precio = producto.precio;
        })
    }

    
    //ORDENAR EL CARRITO POR Vendedores
    this.cart.sort((a, b) => a.id_productor < b.id_productor ? -1 : a.id_productor > b.id_productor ? 1 : 0)

    localStorage.setItem("cart",JSON.stringify(this.cart))


    for(let item of this.cart){
      this.indices.push(item.id_productor);
    }

    this.indices = this.indices.filter((item,index)=>{
      return this.indices.indexOf(item) === index;
    })


    this.infoUsuarioService.getInfoUsuarios()
      .subscribe(usuarios =>{
        for(let indice of this.indices){
          for(let usuario of usuarios){
            if(usuario.id_usuario == indice){
              this.usuarios.push(usuario)
            }
          }
        }
      }
        )

    

    if(this.cart.length == 0){
      this.router.navigate(['/productos/listado'])
    }else{
      this.carro_ordenado = this.groupBy<ItemCarrito>(this.cart,"id_productor")

      await this.infoUsuarioService.delay(1500);



      console.log(this.carro_ordenado[46])

      this.cargado = true;
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
  

  cambiar_total(){
    this.total = this.pedidoService.calcularPrecioTotal();
    console.log(this.total)

  }
  


  DialogHorarios(i:number): void {
    const dialogRef = this.dialog.open(MetodoEnvioComponent, {
      maxHeight: 'calc(100% - 32px)',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'full-screen-modal',
      data: this.usuarios[i],
    });

    dialogRef.afterClosed().subscribe(result => {

      this.cart = JSON.parse(localStorage.getItem("cart")!) || [];
      this.pedidoService.cart = this.cart;

      this.carro_ordenado = this.groupBy<ItemCarrito>(this.cart,"id_productor");
      this.cambiar_total();

    });
  }




}
