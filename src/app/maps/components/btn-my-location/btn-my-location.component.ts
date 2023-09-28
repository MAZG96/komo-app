import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent{

  constructor(private mapService: MapService,
    private placesService: PlacesService) { }

  gotoMyLocation(){
    //if( !this.placesService.isUserLocationReady) throw Error("No tenemos la localización");
    if( !this.mapService.isMapReady) throw Error("No tenemos el mapa");

    console.log("Esdyo");

    this.mapService.flyTo(this.placesService.userLocation!);

  }

}
