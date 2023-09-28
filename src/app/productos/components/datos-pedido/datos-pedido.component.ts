import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { Pedido } from '../../interfaces/pedidos.interface';
import { Package, PedidoUPS } from '../../interfaces/pedidoups.interface';
import { NuevoPedidoComponent } from '../../pages/nuevo-pedido/nuevo-pedido.component';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { UPSService } from '../../services/ups.service';

@Component({
  selector: 'app-datos-pedido',
  templateUrl: './datos-pedido.component.html',
  styleUrls: ['./datos-pedido.component.css']
})
export class DatosPedidoComponent implements OnInit {

  @Input() id_pedido!: number;

  pedido!: Pedido;

  cargado!: boolean;

  pedidoUPS!: PedidoUPS;

  paquete: Package = {
    "Packaging": {
        "Code": "02",
        "Description": ""
    },
    "PackageWeight": {
        "Weight": "0",
        "UnitOfMeasurement": {
            "Code": "KGS"
        }
    }
  };

  constructor(private pedidoService: PedidosService,
              private productoService: ProductosService,
              public dialog: MatDialog,
              private upsService: UPSService) { }

  ngOnInit(): void {

    this.pedidoService.getPedidoPorId(this.id_pedido)
      .subscribe(pedido => this.pedido = pedido)
  }



  crear_envioUPS(){

    this.cargado = false;

    this.pedidoService.getItemPedidos(this.id_pedido).pipe(
      switchMap(items => {


        for(let item of items){

          this.productoService.getProductoPorId(item.id_producto)
            .subscribe(producto => {
              
              this.paquete.PackageWeight.Weight += producto.peso_total; 

            })
          
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
                          "AttentionName": "STELLA NAVARRO TORRES",
                          "Phone": {
                              "Number": "669408450"
                          },
                          "ShipperNumber": "A23243",
                          "Address": {
                              "AddressLine": "CARRETERA BARRIO NUEVO, 79",
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
                          "Name": pedido.nombre+" "+pedido.apellidos,
                          "AttentionName": pedido.nombre+" "+pedido.apellidos,
                          "Phone": {
                              "Number": pedido.telefono,
                          },
                          "FaxNumber": "",
                          "TaxIdentificationNumber": "",
                          "Address": {
                              "AddressLine": pedido.calle+", "+pedido.piso,
                              "City": pedido.localidad,
                              "PostalCode": pedido.codigo_postal,
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
                      "Package": [this.paquete]
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

            if(respuestapedido.ShipmentResponse.Response.ResponseStatus.Description == 'Success'){

              this.pedidoService.getItemPedidos(this.id_pedido)
                .subscribe(itempedidos => {
                  for(let item of itempedidos){
                    item.id_ups = respuestapedido.ShipmentResponse.ShipmentResults.ShipmentIdentificationNumber;
                    

                    this.pedidoService.updateItemPedido(item)
                  }
                })}

                this.cargado= true;
        })
  }


  DialogMostrarPuntosUPS(id_pedido: number): void {
    const dialogRef = this.dialog.open(NuevoPedidoComponent, {
      maxHeight: 'calc(100%)',
      maxWidth: 'calc(100vw - 50px)',
      data: id_pedido
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

}
