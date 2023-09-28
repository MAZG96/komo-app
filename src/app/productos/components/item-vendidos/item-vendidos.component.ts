import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Package, PedidoUPS } from '../../interfaces/pedidoups.interface';
import { Producto } from '../../interfaces/productos.interface';
import { NuevoPedidoComponent } from '../../pages/nuevo-pedido/nuevo-pedido.component';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { UPSService } from '../../services/ups.service';

@Component({
  selector: 'app-item-vendidos',
  templateUrl: './item-vendidos.component.html',
  styleUrls: ['./item-vendidos.component.css']
})
export class ItemVendidosComponent implements OnInit {


  @Input() item!: ItemCarrito;

  pedidoUPS!: PedidoUPS;

  cargado: boolean = true;

  

  enlace_etiqueta!: string;

  paquetes: Package[] = [];

  producto! : Producto;

  constructor(private infoUsuarioService: InfoUsuarioService,
              private productoService: ProductosService,
              private upsService: UPSService,
              private pedidoService: PedidosService,
              public dialog: MatDialog,
              private authService: AuthService) { }
  
  get usuario() {
    return this.authService.auth;
  }

  ngOnInit(): void {
    console.log(this.item)
  }


  crear_envioUPS(){

    this.cargado = false;

    this.productoService.getProductoPorId(this.item.id_producto).pipe(
      switchMap(producto => {

        for(let i=0 ; i<this.item.cantidad; i++){
          this.paquetes.push({
            "Packaging": {
                "Code": "02",
                "Description": ""
            },
            "PackageWeight": {
                "Weight": ""+producto.peso_total,
                "UnitOfMeasurement": {
                    "Code": "KGS"
                }
            }
          })
        }

        return this.pedidoService.getPedidoPorId(this.item.id_pedido!).pipe(
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
                      "Package": this.paquetes
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


            return this.upsService.crear_envio(this.pedidoUPS).pipe(
              switchMap(respuestapedido => {

                console.log(respuestapedido)
                if(respuestapedido.ShipmentResponse.Response.ResponseStatus.Description == 'Success'){
                  this.item.id_ups = respuestapedido.ShipmentResponse.ShipmentResults.ShipmentIdentificationNumber;
                }

                return this.pedidoService.updateItemPedido(this.item)

              })
            )
          })
        )
        
        
      }))
        .subscribe(itempedido => {

          this.cargado = true;
          this.DialogMostrarPuntosUPS(this.item);

        })
  }


  DialogMostrarPuntosUPS(item: ItemCarrito): void {
    const dialogRef = this.dialog.open(NuevoPedidoComponent, {
      maxHeight: 'calc(100%)',
      maxWidth: 'calc(100vw - 50px)',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

}
