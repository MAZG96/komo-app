import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { PagoRealizadoComponent } from '../../components/pago-realizado/pago-realizado.component';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Pedido } from '../../interfaces/pedidos.interface';
import { Producto } from '../../interfaces/productos.interface';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  cart!: ItemCarrito[];

  producto: Producto = {
    id: '',
    nombre: '',
    descripcion: '',
    dias_publicados: '',
    precio: 0,
    peso_total: 0,
    cantidad: '',
    stock: 0,
    foto: '',
    id_categoria: 0,
    id_usuario: 0
  };

  constructor(private pedidoService:PedidosService,
    private authService: AuthService, 
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public router :Router,
    private productoService:ProductosService,
    private sharedService: SharedService) { }

  pedido!:Pedido;


  ngOnInit(): void {
    
    this.route.paramMap.pipe(
      switchMap(params => {
        let id = this.pedidoService.decryptData(params.get("id")).split('komo')[1];

        console.log(id);
        return this.pedidoService.getPedidoPorId(id).pipe(
          switchMap(pedido => {
            console.log(pedido)
            this.pedido = pedido;
            if(pedido.estado == 'Pagado'){
              this.router.navigate(['/productos/fin-pedido', params.get("id")]);
            }

            let fecha_pedido = new Date(pedido.createdAt!); // some mock date
            let hoy = new Date();

            
            let diasDeDiferencia = (hoy.getTime() - fecha_pedido.getTime()) / 1000 / 60 / 60 / 24;

            console.log("hey")
            if(diasDeDiferencia > 1){
              this.mostrarSnakbar("Pedido caducado")
              this.router.navigate(['/', 'productos/listado']);
            }

            this.pedido.id_usuario = this.authService.auth.id || 0;

            return this.pedidoService.getItemPedidos(this.pedido.id)
            
          })
        )
      })
    ).subscribe( itempedidos => {
      this.cart = itempedidos;
    })


    this.accordion.closeAll();
  }


  guardar() {
    
    

    console.log(this.pedidoService.cart)


    /*if(this.checked){

      if(this.infopedido.nombre === null){
        this.infopedido = {
          id: '',
          nombre: this.pedido.nombre,
          apellidos: this.pedido.apellidos,
          calle: this.pedido.calle,
          piso: this.pedido.piso,
          localidad: this.pedido.localidad,
          provincia: this.pedido.provincia,
          codigo_postal: this.pedido.codigo_postal,
          telefono: this.pedido.telefono,
          email: this.pedido.email,
          id_usuario: this.usuario.id,
        }
        this.pedidoService.agregarInfoPedido(this.pedido)
          .subscribe()
      }else{
        this.pedidoService.updateInfoPedido(this.pedido)
          .subscribe()
      }
      
    }*/
  
    //EDITAR STOCKS DE LOS PRODUCTOS

    

    for( let item of this.pedidoService.cart){
      this.productoService.getProductoPorId(item.id_producto).pipe(
        switchMap( producto => {
          
          this.producto = {
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            dias_publicados: producto.dias_publicados,
            precio: producto.precio,
            peso_total: producto.peso_total,
            cantidad: producto.cantidad,
            stock: producto.stock - item.cantidad, //editar el stock del producto
            foto: producto.foto,
            id_categoria: producto.id_categoria,
            id_usuario: producto.id_usuario
          }
          return this.productoService.actualizarProducto(this.producto)
        })
        ).subscribe();
      


    }
       
    this.productoService.getProductos().pipe(
      switchMap( productos => {
        for (var _i = 0; _i < this.pedidoService.cart.length; _i++){
          this.pedidoService.cart[_i] = {
            id: this.pedidoService.cart[_i].id,
            id_producto: this.pedidoService.cart[_i].id_producto,
            id_productor: this.pedidoService.cart[_i].id_productor,
            foto: this.pedidoService.cart[_i].foto,
            nombre: this.pedidoService.cart[_i].nombre,
            cantidad: this.pedidoService.cart[_i].cantidad,
            precio: this.pedidoService.cart[_i].precio,
            recogida: this.pedidoService.cart[_i].recogida,
            pago_recogida:  this.pedidoService.cart[_i].pago_recogida
          }
        
          console.log(this.pedido)
          for (var _j = 0; _j < productos.length; _j++){
            if(productos[_j].id == this.pedidoService.cart[_i].id_producto){
              this.pedidoService.cart[_i].id_productor = productos[_j].id_usuario;
            }
          }
        }
        return  this.pedidoService.agregarPedido(this.pedido).pipe(
          switchMap(pedido => {
            for (var _i = 0; _i < this.pedidoService.cart.length; _i++){
              this.pedidoService.cart[_i] = {
                id: this.pedidoService.cart[_i].id,
                id_producto: this.pedidoService.cart[_i].id_producto,
                foto: this.pedidoService.cart[_i].foto,
                nombre: this.pedidoService.cart[_i].nombre,
                cantidad: this.pedidoService.cart[_i].cantidad,
                precio: this.pedidoService.cart[_i].precio,
                id_productor: this.pedidoService.cart[_i].id_productor,
                recogida: this.pedidoService.cart[_i].recogida,
                pago_recogida:  this.pedidoService.cart[_i].pago_recogida,
                id_pedido: pedido.id
              }
              this.sharedService.SetproductoId = Number(pedido.id);
              
            }

            return this.pedidoService.agregarItemPedido(this.pedidoService.cart).pipe(
              
            )
          })
          
        )}
      )).subscribe(pedido => 
        {
          
      });

  }

  mostrarSnakbar( mensaje: string ) {

    this.snackBar.open( mensaje, 'ok!', {
      duration: 2500
    });

  }

}
