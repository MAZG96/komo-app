import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { MainComponent } from './pages/main/main.component';
import { LoginadminComponent } from './pages/loginadmin/loginadmin.component';
import { ConfirmacionComponent } from '../productos/pages/confirmacion/confirmacion.component';
import { RecuperarComponent } from './pages/recuperar/recuperar.component';
import { RestablecerComponent } from './pages/restablecer/restablecer.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { animation: 'j', AnimationEffect}
      },
      {
        path: 'registro',
        component: RegistroComponent,
        data: { animation: 'k', AnimationEffect}
      },
      {
        path: 'login-admin',
        component: LoginadminComponent
      },
      {
        path: 'recuperar',
        component: RecuperarComponent
      },
      {
        path: 'restablecer/:token_recuperacion',
        component: RestablecerComponent
      },
      {
        path: 'confirmacion/:token',
        component: ConfirmacionComponent
      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild( routes )
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
