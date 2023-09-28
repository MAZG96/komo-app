import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapScreenComponent } from './screens/map-screen/map-screen.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { LoadingComponent } from './components/loading/loading.component';
import { BtnMyLocationComponent } from './components/btn-my-location/btn-my-location.component';
import { BtnLogoAngularComponent } from './components/btn-logo-angular/btn-logo-angular.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { MapSearchComponent } from './screens/map-search/map-search.component';
import { MaterialModule } from '../material/material.module';
import { MapProductoComponent } from './components/map-producto/map-producto.component';
import { MarcadorComponent } from './components/marcador/marcador.component';



@NgModule({
  declarations: [
    MapScreenComponent,
    MapViewComponent,
    LoadingComponent,
    BtnMyLocationComponent,
    BtnLogoAngularComponent,
    SearchBarComponent,
    SearchResultsComponent,
    MapSearchComponent,
    MapProductoComponent,
    MarcadorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    MapScreenComponent,
    MapViewComponent,
    SearchResultsComponent,
    MapProductoComponent
  ]
})
export class MapsModule { }
