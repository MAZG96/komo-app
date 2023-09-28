import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

import { ErrorPageComponent } from './shared/error-page/error-page.component';
import { HomeComponent } from './productos/pages/home/home.component';
import { MapSearchComponent } from './maps/screens/map-search/map-search.component';
import { InicioComponent } from './home/pages/inicio/inicio.component';
import { MapViewComponent } from './maps/components/map-view/map-view.component';
import { AdminGuard } from './auth/guards/admin.guard';
import { SoyProductorComponent } from './home/pages/soy-productor/soy-productor.component';
import { EligePerfiComponent } from './home/pages/elige-perfi/elige-perfi.component';
import { SoyKomoComponent } from './home/pages/soy-komo/soy-komo.component';
import { TextosLegalesComponent } from './home/pages/textos-legales/textos-legales.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ),
    data: { animation: 'd', AnimationEffect}
    
    
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./protected/protected.module').then( m => m.ProtectedModule ),
    canActivate: [ AuthGuard ],
    canLoad: [ AuthGuard ]
    
  },
  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then( m => m.ProductosModule ),
  },
  {
    path: 'backoffice',
    loadChildren: () => import('./backoffice/backoffice.module').then( m => m.BackofficeModule ),
    canLoad: [ AdminGuard ],
    canActivate: [ AdminGuard ]
  },

  {
    path: '404',
    component: HomeComponent
  },

  {
    path: 'mapa-view',
    component: MapSearchComponent
  },

  {
    path: '',
    component: InicioComponent , data: { animation: 'g', AnimationEffect}  
  },
  { path: 'perfil-productor', 
  component: SoyProductorComponent,
  canLoad: [ AuthGuard ],
  canActivate: [ AuthGuard ] 
  },
  
  { path: 'elige-perfil', 
  component: EligePerfiComponent,
  canLoad: [ AuthGuard ],
  canActivate: [ AuthGuard ] 
  },
  { path: 'soy-komo', 
  component: SoyKomoComponent,
  },
  { path: 'textos-legales', 
  component: TextosLegalesComponent,
  },



  {
    path: '**',
    redirectTo: ''
  }
]


@NgModule({
  imports: [
    RouterModule.forRoot( routes, {scrollPositionRestoration: 'enabled', 
    anchorScrolling: 'enabled',scrollOffset: [0, 215],} )
    
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
