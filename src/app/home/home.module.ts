import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './pages/inicio/inicio.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { MapsModule } from '../maps/maps.module';
import { MapSearchComponent } from '../maps/screens/map-search/map-search.component';
import { BarraBuscarComponent } from './components/barra-buscar/barra-buscar.component';
import { SoyProductorComponent } from './pages/soy-productor/soy-productor.component';
import { ProductosModule } from '../productos/productos.module';
import { BackofficeModule } from '../backoffice/backoffice.module';
import { EligePerfiComponent } from './pages/elige-perfi/elige-perfi.component';
import { SoyKomoComponent } from './pages/soy-komo/soy-komo.component';
import { TextosLegalesComponent } from './pages/textos-legales/textos-legales.component';



@NgModule({
  declarations: [
    InicioComponent,
    BarraBuscarComponent,
    SoyProductorComponent,
    EligePerfiComponent,
    SoyKomoComponent,
    TextosLegalesComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    MapsModule,
    ProductosModule,
    BackofficeModule
    
  ]
})
export class HomeModule { }
