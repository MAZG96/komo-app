import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';


import { ProductosRoutingModule } from './productos-routing.module';
import { MaterialModule } from '../material/material.module';

import { AgregarComponent } from './pages/agregar/agregar.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { HomeComponent } from './pages/home/home.component';
import { ListadoComponent } from './pages/listado/listado.component';
import { ProductoTarjetaComponent } from './components/producto-tarjeta/producto-tarjeta.component';
import { ImagenPipe } from './pipes/imagen.pipe';
import { ConfirmarComponent } from './components/confirmar/confirmar.component';
import { MapsModule } from '../maps/maps.module';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { CuentaComponent } from './pages/cuenta/cuenta.component';
import { ProductoListaComponent } from './components/producto-lista/producto-lista.component';
import { InfoUsuarioComponent } from './pages/cuenta/info-usuario/info-usuario.component';
import { ImagenUsuarioPipe } from './pipes/imagen-usuario.pipe';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { CarritoPipe } from './pipes/carrito.pipe';
import { InfoPedidoComponent } from './pages/info-pedido/info-pedido.component';
import { BotonCarroComponent } from './components/boton-carro/boton-carro.component';
import { ResumenPedidoComponent } from './pages/resumen-pedido/resumen-pedido.component';
import { PedidosListaComponent } from './components/pedidos-lista/pedidos-lista.component';
import { ProductorListaComponent } from './pages/productor-lista/productor-lista.component';
import { BusquedaComponent } from './pages/busqueda/busqueda.component';
import { ResultadoBusquedaComponent } from './pages/resultado-busqueda/resultado-busqueda.component';
import { FormsModule } from '@angular/forms';
import { BarRatingModule } from 'ngx-bar-rating';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ComentariosListaComponent } from './components/comentarios-lista/comentarios-lista.component';
import { TextoZonaComponent } from './components/texto-zona/texto-zona.component';
import { CheckRecogerComponent } from './components/check-recoger/check-recoger.component';
import { ItemPedidoComponent } from './components/item-pedido/item-pedido.component';
import { InfoProductorComponent } from './components/info-productor/info-productor.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { ItemFavoritoComponent } from './components/item-favorito/item-favorito.component';
import { ListadoZonaComponent } from './pages/listado-zona/listado-zona.component';
import { ProductoZonaComponent } from './components/producto-zona/producto-zona.component';
import { TextoRecogeComponent } from './components/texto-recoge/texto-recoge.component';
import { TextoPuntoComponent } from './components/texto-punto/texto-punto.component';
import { ItemVendidosComponent } from './components/item-vendidos/item-vendidos.component';
import { VendidosListaComponent } from './components/vendidos-lista/vendidos-lista.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TextocomprobardatosComponent } from './components/textocomprobardatos/textocomprobardatos.component';
import { HorarioRecogidaComponent } from './components/horario-recogida/horario-recogida.component';
import { ElegirHorasComponent } from './components/elegir-horas/elegir-horas.component';
import { SplitPipe } from './pipes/split.pipe';
import { TextoUbicacionComponent } from './components/texto-ubicacion/texto-ubicacion.component';
import { MetodoEnvioComponent } from './components/metodo-envio/metodo-envio.component';
import { UnificarComponent } from './components/unificar/unificar.component';
import { PagoStripeComponent } from './components/pago-stripe/pago-stripe.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { FinPedidoComponent } from './pages/fin-pedido/fin-pedido.component';
import { ConfirmacionComponent } from './pages/confirmacion/confirmacion.component';
import { TextoPagoRecogidaComponent } from './components/texto-pago-recogida/texto-pago-recogida.component';
import { TextoPopComponent } from './components/texto-pop/texto-pop.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AvisoPrivacidadComponent } from './components/aviso-privacidad/aviso-privacidad.component';
import { DevolucionesReembolsosComponent } from './components/devoluciones-reembolsos/devoluciones-reembolsos.component';
import { PoliticaCookiesComponent } from './components/politica-cookies/politica-cookies.component';
import { CondicionesUsoComponent } from './components/condiciones-uso/condiciones-uso.component';
import { PagoRealizadoComponent } from './components/pago-realizado/pago-realizado.component';
import { ItemProductorComponent } from './components/item-productor/item-productor.component';
import { ElegirzonaComponent } from './components/elegirzona/elegirzona.component';
import { NuevoPedidoComponent } from './pages/nuevo-pedido/nuevo-pedido.component';
import { ItemAccesspointComponent } from './components/item-accesspoint/item-accesspoint.component';
import { TextoApointComponent } from './components/texto-apoint/texto-apoint.component';
import { DatosPedidoComponent } from './pages/datos-pedido/datos-pedido.component';
import { ListaUnificadoComponent } from './components/lista-unificado/lista-unificado.component';
import { ListaRecogidaComponent } from './components/lista-recogida/lista-recogida.component';
import { ListaFrioComponent } from './components/lista-frio/lista-frio.component';
import { ZonaNombreComponent } from './components/zona-nombre/zona-nombre.component';
import { TotalPedidoComponent } from './components/total-pedido/total-pedido.component';
import { ModificarInfoPedidoComponent } from './pages/modificar-info-pedido/modificar-info-pedido.component';
import { ModificarCarritoComponent } from './components/modificar-carrito/modificar-carrito.component';
import { DetallesPedidoComponent } from './components/detalles-pedido/detalles-pedido.component';
import { DetallesCompradorComponent } from './components/detalles-comprador/detalles-comprador.component';
import { UsuarioNombreComponent } from './components/usuario-nombre/usuario-nombre.component';
import { UsuarioRecogidaComponent } from './components/usuario-recogida/usuario-recogida.component';
import { TextoCarritoRecogidaComponent } from './components/texto-carrito-recogida/texto-carrito-recogida.component';
import { TextoFrioComponent } from './components/texto-frio/texto-frio.component';
import { ElegirPesoComponent } from './components/elegir-peso/elegir-peso.component';
import { ListaEnvioComponent } from './components/lista-envio/lista-envio.component';
import { BotonCarroPrivadoComponent } from './components/boton-carro-privado/boton-carro-privado.component';
import { PedidoResumenComponent } from './pedido-resumen/pedido-resumen.component';
import { ElementoPedidoComponent } from './components/elemento-pedido/elemento-pedido.component';






@NgModule({
  declarations: [
    AgregarComponent,
    BuscarComponent,
    ProductoComponent,
    HomeComponent,
    ListadoComponent,
    ProductoTarjetaComponent,
    ImagenPipe,
    ConfirmarComponent,
    FileUploadComponent,
    CuentaComponent,
    ProductoListaComponent,
    InfoUsuarioComponent,
    ImagenUsuarioPipe,
    CarritoComponent,
    CarritoPipe,
    InfoPedidoComponent,
    BotonCarroComponent,
    ResumenPedidoComponent,
    PedidosListaComponent,
    ProductorListaComponent,
    BusquedaComponent,
    ResultadoBusquedaComponent,
    ComentariosComponent,
    ComentariosListaComponent,
    TextoZonaComponent,
    CheckRecogerComponent,
    ItemPedidoComponent,
    InfoProductorComponent,
    FavoritosComponent,
    ItemFavoritoComponent,
    ListadoZonaComponent,
    ProductoZonaComponent,
    TextoRecogeComponent,
    TextoPuntoComponent,
    ItemVendidosComponent,
    VendidosListaComponent,
    TextocomprobardatosComponent,
    HorarioRecogidaComponent,
    ElegirHorasComponent,
    SplitPipe,
    TextoUbicacionComponent,
    MetodoEnvioComponent,
    UnificarComponent,
    PagoStripeComponent,
    CategoriaComponent,
    FinPedidoComponent,
    ConfirmacionComponent,
    TextoPagoRecogidaComponent,
    TextoPopComponent,
    CheckoutComponent,
    AvisoPrivacidadComponent,
    DevolucionesReembolsosComponent,
    PoliticaCookiesComponent,
    CondicionesUsoComponent,
    PagoRealizadoComponent,
    ItemProductorComponent,
    ElegirzonaComponent,
    NuevoPedidoComponent,
    ItemAccesspointComponent,
    TextoApointComponent,
    DatosPedidoComponent,
    ListaUnificadoComponent,
    ListaRecogidaComponent,
    ListaFrioComponent,
    ZonaNombreComponent,
    TotalPedidoComponent,
    ModificarInfoPedidoComponent,
    ModificarCarritoComponent,
    DetallesPedidoComponent,
    DetallesCompradorComponent,
    UsuarioNombreComponent,
    UsuarioRecogidaComponent,
    TextoCarritoRecogidaComponent,
    TextoFrioComponent,
    ElegirPesoComponent,
    ListaEnvioComponent,
    BotonCarroPrivadoComponent,
    PedidoResumenComponent,
    ElementoPedidoComponent
    


    ],
  exports:[
    ImagenPipe,
    CarritoPipe,
    ImagenUsuarioPipe,
    InfoUsuarioComponent,
    ProductoListaComponent,
    PedidosListaComponent,
    VendidosListaComponent,
    AvisoPrivacidadComponent,
    CondicionesUsoComponent,
    PoliticaCookiesComponent,
    DevolucionesReembolsosComponent,
    SplitPipe



  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    ProductosRoutingModule,
    MapsModule,
    BarRatingModule, 
    FontAwesomeModule,

  ]
})
export class ProductosModule { }
