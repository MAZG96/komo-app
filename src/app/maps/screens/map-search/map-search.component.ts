import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-map-search',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.css']
})
export class MapSearchComponent {

  constructor(private placesService: PlacesService) { }

  /*get isUserLocationReady(){
    return this.placesService.isUserLocationReady;
  }*/
  
}
