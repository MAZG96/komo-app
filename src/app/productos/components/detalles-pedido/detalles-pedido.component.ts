import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Pedido } from '../../interfaces/pedidos.interface';
import { Package, PedidoUPS } from '../../interfaces/pedidoups.interface';
import { NuevoPedidoComponent } from '../../pages/nuevo-pedido/nuevo-pedido.component';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { UPSService } from '../../services/ups.service';
import { DetallesCompradorComponent } from '../detalles-comprador/detalles-comprador.component';

@Component({
  selector: 'app-detalles-pedido',
  templateUrl: './detalles-pedido.component.html',
  styleUrls: ['./detalles-pedido.component.css']
})
export class DetallesPedidoComponent implements OnInit {

  @Input() id_pedido!: number;

  pedido!: Pedido;

  cargado: boolean = true;

  pedidoUPS!: PedidoUPS;

  itemMBE: string[] = [];

  item_uno!: ItemCarrito;

  total_venta: number = 0;

  constructor(private pedidoService: PedidosService,
              private productoService: ProductosService,
              public dialog: MatDialog,
              private authService: AuthService,
              private upsService: UPSService) { }

  get usuario() {
    return this.authService.auth;
  }


            

  ngOnInit(): void {

    this.pedidoService.getPedidoPorId(this.id_pedido)
      .subscribe(pedido => this.pedido = pedido)

    this.pedidoService.getItemPedidos(this.id_pedido)
      .subscribe(itempedidos => {
        for(let item of itempedidos){
          if(item.id_productor == this.usuario.id){
            this.item_uno = item;
            this.total_venta += (item.precio * item.cantidad);
          }
        }
      })
  }



  crear_envioMBE(){



    this.cargado = false;

    this.pedidoService.getItemPedidos(this.id_pedido).pipe(
      switchMap(items => {


        for(let item of items){

          if(item.id_productor == this.usuario.id){

          this.productoService.getProductoPorId(item.id_producto)
            .subscribe(producto => {

              this.itemMBE.push('<Item><Weight>'+producto.peso_total*item.cantidad+'</Weight><Dimensions></Dimensions></Item>');

            })
          }
        }

        return this.pedidoService.getPedidoPorId(this.id_pedido!).pipe(
          switchMap(pedido => {

            this.pedidoUPS = {
              "ShipmentRequest": {
                  "Shipment": 
                  
                  {
                      "Description": "",
                      "Shipper": {
                          "Name": "KOMO LOCAL FOODS",
                          "AttentionName": "AttentionName",
                          "Phone": {
                              "Number": "669408450"
                          },
                          "ShipperNumber": "A23243",
                          "Address": {
                              "AddressLine": "LUGAR DONDE VOLVERÁ PAQUETE",
                              "City": "BARRIO NUEVO",
                              "PostalCode": "11141",
                              "CountryCode": "ES"
                          }
                      },
                      "ShipFrom": {
                          "Name": "NOMBRE COMPRADOR",
                          "AttentionName": "EJEMPLO",
                          "Phone": {
                              "Number": "6123456456"
                          },
                          "FaxNumber": "",
                          "TaxIdentificationNumber": "",
                          "Address": {
                              "AddressLine": "DESTINO",
                              "City": "CIUDAD DESTINO",
                              "PostalCode": "11140",
                              "CountryCode": "ES"
                          }
                      },
                      "ShipTo": {
                          "Name": "NOMBRE COMPRADOR",
                          "AttentionName": "EJEMPLO",
                          "Phone": {
                              "Number": "6123456456"
                          },
                          "FaxNumber": "",
                          "TaxIdentificationNumber": "",
                          "Address": {
                              "AddressLine": "DESTINO",
                              "City": "CIUDAD DESTINO",
                              "PostalCode": "11140",
                              "CountryCode": "ES"
                          }
                      },
                      "PaymentInformation": {
                          "ShipmentCharge": {
                              "Type": "01",
                              "BillShipper": {
                                  "AccountNumber": "A23243"
                              }
                          }
                      },
                      "Service": {
                          "Code": "11",
                          "Description": "STANDARD"
                      },
                      "Package": [{
                          "Packaging": {
                              "Code": "02",
                              "Description": "aa"
                          },
                          "PackageWeight": {
                              "Weight": "1",
                              "UnitOfMeasurement": {
                                  "Code": "KGS"
                              }
                          }
                      }]
                  },
                  "LabelSpecification": {
                      "LabelImageFormat": {
                          "Code": "GIF",
                          "Description": ""
                      },
                      "LabelStockSize": {
                          "Height": "6",
                          "Width": "4"
                      }
                  }
              }
          }


            return this.upsService.crear_envio(this.pedidoUPS)
          })
        )
        
        
      }))
        .subscribe(respuestapedido => {

            console.log(respuestapedido)

            if(respuestapedido.ShipmentResponse.Response.ResponseStatus.Description == 'Success'){

              this.pedidoService.getItemPedidos(this.id_pedido)
                .subscribe(itempedidos => {
                  for(let item of itempedidos){

                    if(item.id_productor == this.usuario.id){
                      item.id_ups = respuestapedido.ShipmentResponse.ShipmentResults.ShipmentIdentificationNumber;

                      this.pedidoService.updateItemPedido(item)
                        .subscribe(item =>{})
                    }
                    
                  }

                  this.item_uno.id_ups = respuestapedido.ShipmentResponse.ShipmentResults.ShipmentIdentificationNumber;
                })}
                else{
                  this.item_uno.id_ups = '';
                }

                this.cargado= true;
        })
  }



  DialogMostrarPuntosUPS(): void {
    const dialogRef = this.dialog.open(NuevoPedidoComponent, {
      maxHeight: 'calc(100%)',
      maxWidth: 'calc(100vw - 50px)',
      data: this.item_uno
    });
    

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }


  DialogMostrarDetallesPedido(): void {
    const dialogRef = this.dialog.open(DetallesCompradorComponent, {
      maxHeight: 'calc(100%)',
      maxWidth: 'calc(100vw - 50px)',
      data: this.id_pedido
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
