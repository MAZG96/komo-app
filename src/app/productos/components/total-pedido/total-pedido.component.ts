import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Pedido } from '../../interfaces/pedidos.interface';
import { Package } from '../../interfaces/precioups.interface';
import { PedidoUPS } from '../../interfaces/pedidoups.interface';
import { PackageWeight, PrecioUPS } from '../../interfaces/precioups.interface';
import { ProductosService } from '../../services/productos.service';
import { UPSService } from '../../services/ups.service';
import { NgxXmlToJsonService } from 'ngx-xml-to-json';
import { SharedService } from 'src/app/services/shared.service';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-total-pedido',
  templateUrl: './total-pedido.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./total-pedido.component.css']
})
export class TotalPedidoComponent implements OnInit {

  @Input() carrito_unificado!: ItemCarrito[];
  @Input() carrito_recogida!: ItemCarrito[];
  @Input() carrito_frio!: ItemCarrito[];


  @Output() newItemEvent = new EventEmitter<number>();

  addNewItem(value: number) {
    this.newItemEvent.emit(value);
  }
  
  total_unificado!: number;
  total_recogida!: number;
  total_frio!: number;
  total_pago_recogida!: number;

  total_calculado: boolean = false;

  total_envio!: number;

  total!: number;

  pedidoUps!:PedidoUPS;

  pedido:Pedido ={
    id: 0,
    nombre: '',
    apellidos: '',
    calle: '',
    piso: '',
    localidad: '',
    provincia: '',
    codigo_postal: '',
    telefono: '',
    email: '',
    total: 0,
    id_usuario: 0,
  }

  paquetes: Package[] =[];

  peso_total_paquete: number = 0;

  itemMBE: String[] = [];

  precioUPS!: PrecioUPS;

  tipo_venta!: number;

  constructor(private productoService: ProductosService,
              private pedidoService: PedidosService,
              private sharedService: SharedService,
              private ngxXmlToJsonService: NgxXmlToJsonService,
              private upsService: UPSService) { }

  ngOnChanges(changes: SimpleChanges) {
    //this.cargar_factura();

    if(changes.carrito_unificado.firstChange == false){
      this.cargar_factura();
    }

  }

  ngOnInit(): void {


    if(this.carrito_unificado){
      this.cargar_factura();
    }


    this.tipo_venta = this.sharedService.Gettipo_venta
    

    //this.total_recogida = this.calcularPagoRecogida(this.carrito_recogida);
    //this.total_frio = this.calcularPrecioTotal(this.carrito_frio);
  
  }

  cargar_factura(){
    
    this.itemMBE = [];

    this.paquetes = [];

    this.peso_total_paquete = 0;

    if(this.carrito_unificado){

      this.productoService.getProductos()
          .subscribe(productos => {
              this.paquetes = [];
              for(let producto of productos){
                  for(let item of this.carrito_unificado){
                      if(item.id_producto == producto.id){


                          this.peso_total_paquete += producto.peso_total*item.cantidad;

                          //this.itemMBE.push('<Item><Weight>'+producto.peso_total*item.cantidad+'</Weight><Dimensions></Dimensions></Item>');
                          
                      }
                  }
              }
  
              this.inicializar_pedidoUPS();
  
          })
        
      this.total_pago_recogida = this.calcularPagoRecogida(this.carrito_unificado);
      this.total_unificado = this.calcularPrecioTotal(this.carrito_unificado);

      

      }
  }
  

  inicializar_pedidoUPS(){
    
    if(localStorage.getItem("info-pedido")){
        this.pedido = JSON.parse(localStorage.getItem("info-pedido")!);
    }else{
        //volver al inicio
    }

   if(this.tipo_venta == 2){ // SI ES RECOGIDA, NO SE CALCULA EL ENVÍO

    this.total = (this.total_unificado-this.total_pago_recogida)+((this.total_unificado+this.total_pago_recogida)*0.03);
    this.addNewItem(this.total); //envia el total a padre

  }else if(this.tipo_venta == 3){
    this.total_envio = this.pedidoService.calcular_precio_envio_frio(this.peso_total_paquete);

    this.total = this.total_envio+this.total_unificado+(this.total_unificado*0.03);

    this.addNewItem(this.total);
  }
  else{

   /*this.upsService.calcular_tarifaMBE(this.itemMBE, this.pedido)
    .subscribe(res => {
      
      this.total_envio = Number(this.upsService.XMLTOJSON(res.rawHTML)['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns3:ShippingOptionsRequestResponse']
      .RequestContainer.ShippingOptions.ShippingOption[0][1].GrossShipmentTotalPrice.text);

      this.total = this.total_envio+this.total_unificado+(this.total_unificado*0.03);

      this.addNewItem(this.total);

    })*/


    this.total_envio = this.pedidoService.calcular_precio_envio(this.peso_total_paquete);

    this.total = this.total_envio+this.total_unificado+(this.total_unificado*0.03);

    this.addNewItem(this.total);
    
    

    
  }


  }

  calcularPrecioTotal(carrito: ItemCarrito[]): number{
    let total = 0;

    for (let item of carrito){
      console.log("calculando precio")
      console.log(item.precio)
      if((item.estado != "No Disponible" && item.estado != "No Stock")   ){
        total = total + (item.precio * item.cantidad);
      }
    }

    return Number((total).toFixed(2));
  }


  calcularPrecioFrio(carrito: ItemCarrito[]): number{
    let total = 0;

    for (let item of carrito){
      if((item.estado != "No Disponible" && item.estado != "No Stock") ){
        total = total + (item.precio * item.cantidad);
      }

    }

    return total;
  }

  calcularPagoRecogida(carrito: ItemCarrito[]): number{

    let total = 0;

    for (let item of carrito){
      
      console.log(item)
      if((item.estado != "No Disponible" && item.estado != "No Stock") && item.pago_recogida == 1){
        total = total + (item.precio * item.cantidad);
      }
    }

    console.log(total)
    return total;
  }

}
