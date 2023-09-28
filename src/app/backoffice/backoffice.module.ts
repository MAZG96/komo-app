import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { TablaPedidosComponent } from './components/tabla-pedidos/tabla-pedidos.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { BackOfficeRoutingModule } from './backoffice-routing.module';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { ElementoPedidosComponent } from './components/elemento-pedidos/elemento-pedidos.component';
import { TablaProductosComponent } from './components/tabla-productos/tabla-productos.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { TablaUsuariosComponent } from './components/tabla-usuarios/tabla-usuarios.component';
import { ProductorComponent } from './pages/productor/productor.component';
import { ElementoProductosComponent } from './components/elemento-productos/elemento-productos.component';
import { ChartsModule} from 'ng2-charts';
import { GraficaVentasComponent } from './components/grafica-ventas/grafica-ventas.component';
import { ComentariosComponent } from './pages/comentarios/comentarios.component';
import { ItemComentarioComponent } from './components/item-comentario/item-comentario.component';
import { ZonaComponent } from './pages/zona/zona.component';
import { ItemZonaComponent } from './components/item-zona/item-zona.component';
import { HorarioComponent } from './components/horario/horario.component';
import { ElegirHoraComponent } from './components/elegir-hora/elegir-hora.component';
import { SplitPipe } from '../productos/pipes/split.pipe';
import { ProductosModule } from '../productos/productos.module';
import { MostrarZonaComponent } from './components/mostrar-zona/mostrar-zona.component';
import { MostrarOrigenComponent } from './components/mostrar-origen/mostrar-origen.component';
import { TablaUsuarioInactivosComponent } from './components/tabla-usuario-inactivos/tabla-usuario-inactivos.component';



@NgModule({
  declarations: [
    TablaPedidosComponent,
    InicioComponent,
    PedidoComponent,
    ElementoPedidosComponent,
    TablaProductosComponent,
    ProductoComponent,
    TablaUsuariosComponent,
    ProductorComponent,
    ElementoProductosComponent,
    GraficaVentasComponent,
    ComentariosComponent,
    ItemComentarioComponent,
    ZonaComponent,
    ItemZonaComponent,
    HorarioComponent,
    ElegirHoraComponent,
    MostrarZonaComponent,
    MostrarOrigenComponent,
    TablaUsuarioInactivosComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    BackOfficeRoutingModule,
    FormsModule,
    MaterialModule,
    ChartsModule,
    ProductosModule,
    
  ]
})
export class BackofficeModule { }
