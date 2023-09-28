import { Component, Input} from '@angular/core';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styles: [
  ]
})
export class MapScreenComponent  {


  @Input() centro_mapa:[number,number] = [0,0];

  


  constructor(private placesService: PlacesService) { }

  /*get isUserLocationReady(){
    return this.placesService.isUserLocationReady;
  }*/
  

}
