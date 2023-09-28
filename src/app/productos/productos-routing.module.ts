import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarComponent } from './pages/agregar/agregar.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { ListadoComponent } from './pages/listado/listado.component';
import { HomeComponent } from './pages/home/home.component';
import { CuentaComponent } from './pages/cuenta/cuenta.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { InfoPedidoComponent } from './pages/info-pedido/info-pedido.component';
import { ProductorListaComponent } from './pages/productor-lista/productor-lista.component';
import { BusquedaComponent } from './pages/busqueda/busqueda.component';
import { ResultadoBusquedaComponent } from './pages/resultado-busqueda/resultado-busqueda.component';
import { ResumenPedidoComponent } from './pages/resumen-pedido/resumen-pedido.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { ListadoZonaComponent } from './pages/listado-zona/listado-zona.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PagoStripeComponent } from './components/pago-stripe/pago-stripe.component';
import { FinPedidoComponent } from './pages/fin-pedido/fin-pedido.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AvisoPrivacidadComponent } from './components/aviso-privacidad/aviso-privacidad.component';
import { CondicionesUsoComponent } from './components/condiciones-uso/condiciones-uso.component';
import { DevolucionesReembolsosComponent } from './components/devoluciones-reembolsos/devoluciones-reembolsos.component';
import { PoliticaCookiesComponent } from './components/politica-cookies/politica-cookies.component';
import { PagoRealizadoComponent } from './components/pago-realizado/pago-realizado.component';
import { NuevoPedidoComponent } from './pages/nuevo-pedido/nuevo-pedido.component';
import { DatosPedidoComponent } from './pages/datos-pedido/datos-pedido.component';
import { PedidoResumenComponent } from './pedido-resumen/pedido-resumen.component';

const rutas: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'listado', component: ListadoComponent,data: { animation: 'a', AnimationEffect} },
      { path: 'listado-zona', component: ListadoZonaComponent },
      { path: 'agregar', component: AgregarComponent,data: { animation: 'c', AnimationEffect},

      canLoad: [ AuthGuard ],
      canActivate: [ AuthGuard ] 
      },
      { path: 'favoritos', component: FavoritosComponent, data: { animation: 'd', AnimationEffect},
      canLoad: [ AuthGuard ],
      canActivate: [ AuthGuard ] 
      },
      { path: 'cuenta', component: CuentaComponent,
        canLoad: [ AuthGuard ],
        canActivate: [ AuthGuard ] 
      },
      { path: 'pedidos/:id', component:  PedidoResumenComponent},
      { path: 'pedidos', component:  PedidoResumenComponent},
      { path: 'cesta', component: CarritoComponent}, 
      { path: 'info-pedido', component: InfoPedidoComponent, data: { animation: 'g', AnimationEffect} },
      { path: 'checkout/:id', component: CheckoutComponent, data: { animation: 'l', AnimationEffect} },
      { path: 'resumen-pedido', component: ResumenPedidoComponent, data: { animation: 'f', AnimationEffect} },
      { path: 'productor', component: ProductorListaComponent, },
      { path: 'editar', component: AgregarComponent,
      canLoad: [ AuthGuard ],
      canActivate: [ AuthGuard ] 
      },
      { path: 'fin-pedido/:id', component: FinPedidoComponent },
      { path: 'datos-pedido', component: DatosPedidoComponent },
      { path: 'busqueda', component: BuscarComponent },
      { path: 'nuevo-pedido', component: NuevoPedidoComponent},
      { path: 'busqueda/resultado/:id', component: ResultadoBusquedaComponent },
      { path: 'producto', component: ProductoComponent },
      { path: 'politica-privacidad', component: AvisoPrivacidadComponent },
      { path: 'condiciones-uso-venta', component: CondicionesUsoComponent },
      { path: 'devoluciones-reembolsos', component: DevolucionesReembolsosComponent },
      { path: 'politica-cookies', component: PoliticaCookiesComponent },
      { path: 'pago-exito', component: PagoRealizadoComponent },






      { path: '**', redirectTo: '/productos/listado' }
    ]
    
  }
];


@NgModule({
  imports: [
    RouterModule.forChild( rutas )
  ],
  exports: [
    RouterModule
  ]
})
export class ProductosRoutingModule { }
