import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { ErrorPageComponent } from './shared/error-page/error-page.component';
import { MaterialModule } from './material/material.module';
import { MapsModule } from './maps/maps.module';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faStarHalfAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

import { BarRatingModule } from 'ngx-bar-rating';
import { InicioComponent } from './backoffice/pages/inicio/inicio.component';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BaseURLInterceptor } from './baseurlinterceptor';
import { HttpErrorInterceptor } from './httperrorinterceptor';
import { HomeModule } from './home/home.module';


@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    HomeModule,
    MapsModule,
    BarRatingModule, 
    FontAwesomeModule, ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: environment.production,
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BaseURLInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(library: FaIconLibrary) {
    library.addIcons(faStar, faStarHalfAlt, farStar, faTimesCircle);

    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  }
}
