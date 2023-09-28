import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { access } from 'fs';
import { NgxXmlToJsonService } from 'ngx-xml-to-json';
import { switchMap } from 'rxjs/operators';
import { TextoApointComponent } from '../../components/texto-apoint/texto-apoint.component';
import { TextoPopComponent } from '../../components/texto-pop/texto-pop.component';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Package, PedidoUPS } from '../../interfaces/pedidoups.interface';
import { DropLocation } from '../../interfaces/pointups.interface';
import { UPSPoint } from '../../interfaces/pointups.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { UPSService } from '../../services/ups.service';
import { Pedido } from '../../interfaces/pedidos.interface';
import { ZonaService } from 'src/app/backoffice/services/zona.service';
import { Zona } from '../../interfaces/zona.interface';

@Component({
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.css']
})
export class NuevoPedidoComponent implements OnInit {

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public item: ItemCarrito,
              private ngxXmlToJsonService: NgxXmlToJsonService,
              private upsService: UPSService,
              private pedidoService: PedidosService,
              private zonaService: ZonaService,
              private productoService: ProductosService,
              private infousuarioService: InfoUsuarioService,
              public dialog: MatDialog) { }

  puntos_ups!:UPSPoint;

  access_point!: DropLocation[];

  verhora: boolean[] = [];

  horario: string[] = [];

  zona!: Zona;

  pedido!: Pedido;

  pedidoUPS!: PedidoUPS;

  enlace_etiqueta!: string;

  paquetes: Package[] = [];

  ngOnInit(): void {

    console.log(this.item)

    this.pedidoService.getPedidoPorId(this.item.id_pedido!)
      .subscribe(pedido => this.pedido = pedido)


    if(this.item.id_ups  != '0'){
      this.zonaService.getZona(Number(this.item.id_ups!))
        .subscribe(zona => this.zona = zona)
    }
    /*console.log(this.item)

    if(this.item){

      this.pedidoService.getItemPedidos(this.item.id_pedido!).pipe(
        switchMap(pedido => {

          return this.upsService.generar_etiqueta(this.item.id_ups!)
        })
      )
      .subscribe(response => {
        console.log(response)
        
        this.enlace_etiqueta = response.LabelRecoveryResponse?.LabelResults?.LabelImage?.URL || 'hola';

        console.log(this.enlace_etiqueta)

      })
      
      this.infousuarioService.getInfoUsuario(this.item.id_productor).pipe(
        switchMap(usuario =>{

          console.log(usuario)
          return this.upsService.access_point(usuario.cp_envio!)
        })
      )
      .subscribe(res => {
        
        this.puntos_ups = this.ngxXmlToJsonService.xmlToJson(res.rawHTML, this.upsService.options).LocatorResponse.SearchResults;

        this.access_point = this.puntos_ups.DropLocation;

        for(let item of this.access_point){
          //Mon-Fri: 7:00am-10:00pm; Sat, Sun: 8:00am-10:00pm
          item.StandardHoursOfOperation.text = item.StandardHoursOfOperation.text.replace("Mon","Lunes");
          item.StandardHoursOfOperation.text= item.StandardHoursOfOperation.text.replace("Fri","Viernes");
          item.StandardHoursOfOperation.text= item.StandardHoursOfOperation.text.replace("Sat","Sábado");
          item.StandardHoursOfOperation.text= item.StandardHoursOfOperation.text.replace("Sun","Domingo");
          item.StandardHoursOfOperation.text= item.StandardHoursOfOperation.text.replace("Closed","Cerrado");

        }
      })
    }*/


  }

  ver_horario(item: DropLocation, index: number){
    //this.horario = hora.split(';');

    for( let i of this.horario){
      i = i.replace(", ", "-")
    }

    this.verhora[index] = true

    const dialogRef = this.dialog.open(TextoApointComponent, {
      maxHeight: 'calc(100% - 32px)',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'full-screen-modal',
      data: {data: item},
    });
  }


}
