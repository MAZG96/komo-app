
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { SoyProductorComponent } from './pages/soy-productor/soy-productor.component';
import { AuthGuard } from '../auth/guards/auth.guard';




const rutas: Routes = [

];


@NgModule({

  imports: [
    RouterModule.forChild( rutas )
  ],
  exports: [
    RouterModule
  ]
  
})
export class HomeRoutingModule { }