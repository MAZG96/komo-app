import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration,  ChartDataSets,  ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { Pedido } from 'src/app/productos/interfaces/pedidos.interface';
import { PedidosService } from 'src/app/productos/services/pedidos.service';


@Component({
  selector: 'app-grafica-ventas',
  templateUrl: './grafica-ventas.component.html',
  styleUrls: ['./grafica-ventas.component.css']
})
export class GraficaVentasComponent implements OnInit{
  
  public doughnutChartLabels: Label[] = [];
  public doughnutChartData: MultiDataSet = [];
  public label: Label =  'Ventas';
  public doughnutChartType: ChartType = 'line';
  public datos: number[] =  [];
  public labels: string[] =  [];

  

  

  constructor( private pedidosService: PedidosService ) { }

  ngOnInit(): void {

    this.pedidosService.getDatosGraficaDonaData()
      .subscribe( data => {
        console.log(data);
        

        /*this.doughnutChartLabels = labels;
        this.doughnutChartData.push( values );*/

       });

    this.pedidosService.getDatosGraficaDonaData()
      .subscribe( data  => {


        for (let item of data){
          this.labels.push(this.pedidosService.meses[item.Mes-1]);
          this.datos.push(item.ventas);
        }

        this.doughnutChartLabels = this.labels;
        this.doughnutChartData.push( this.datos);


      })

  }
}
