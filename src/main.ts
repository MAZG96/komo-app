import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

if (environment.production) {

  window.console.log = () => {}
  enableProdMode();
}


 
Mapboxgl.accessToken = 'pk.eyJ1IjoibWF6ZyIsImEiOiJjbDBpNXJoZXgwMHo2M2NydG56bWh5Y245In0.bPgpmLX3JcZqyCu3on7qAw';


if(!navigator.geolocation){
  alert('Navegador no soporta la Geolocalización');
  throw new Error('Navegador no soporta la Geolocalización');
}



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


  declare global {
    interface window {
      handleCredentialResponse: (response: any) => void;
    }
  
}


