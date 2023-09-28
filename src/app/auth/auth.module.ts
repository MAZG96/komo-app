import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from '../material/material.module';
import { MainComponent } from './pages/main/main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginadminComponent } from './pages/loginadmin/loginadmin.component';
import { RecuperarComponent } from './pages/recuperar/recuperar.component';
import { RestablecerComponent } from './pages/restablecer/restablecer.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent,
    MainComponent,
    LoginadminComponent,
    RecuperarComponent,
    RestablecerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
