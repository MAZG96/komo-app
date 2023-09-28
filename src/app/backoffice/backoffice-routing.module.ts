import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TablaPedidosComponent } from './components/tabla-pedidos/tabla-pedidos.component';
import { TablaProductosComponent } from './components/tabla-productos/tabla-productos.component';
import { TablaUsuariosComponent } from './components/tabla-usuarios/tabla-usuarios.component';
import { ComentariosComponent } from './pages/comentarios/comentarios.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { ProductorComponent } from './pages/productor/productor.component';
import { ZonaComponent } from './pages/zona/zona.component';
import { TablaUsuarioInactivosComponent } from './components/tabla-usuario-inactivos/tabla-usuario-inactivos.component';



const rutas: Routes = [
  {
    path: '',
    component: InicioComponent,
    children: [
      { path: 'pedidos', component: TablaPedidosComponent },
      { path: 'pedidos/:id', component: PedidoComponent },
      { path: 'productos', component: TablaProductosComponent },
      { path: 'inactivos', component: TablaUsuarioInactivosComponent },
      { path: 'comentarios', component: ComentariosComponent },
      { path: 'productos/:id', component: ProductoComponent },
      { path: 'usuarios', component: TablaUsuariosComponent },
      { path: 'productor/:id', component: ProductorComponent },
      { path: 'zonas', component: ZonaComponent },
      { path: '**', redirectTo: 'pedidos'}, 
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
export class BackOfficeRoutingModule { }
