import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlacesResponse, Feature } from '../interfaces/place';
import { PlaceApiClient } from '../apis/placeApiClient';
import { MapService } from './map.service';



@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number] = [-3.703583,40.416705];

  public isLoadingPlaces: boolean = false;

  

  public places: Feature[] = [];

  /*get isUserLocationReady(): boolean{
    return !!this.userLocation // devuelve true si existe localización
  }*/

  constructor(private placesApi: PlaceApiClient,
    private mapService: MapService) { 
    //this.getUserLocation();
  }

  /*public async getUserLocation(): Promise <[number,number]> {
    
    return new Promise ( (resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        ({coords}) => {
          this.userLocation =[coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        ( err ) => {
          alert("No se pudo obtener la localización");
          console.log(err)
        }

      );

    });
  }*/

  getPlacesByQuery( query: string ){

    if( query.length === 0){ //si la barra esta vacía no hay busqueda
      this.isLoadingPlaces = false;
      this.places =[];
      return;
    }

    if( !this.userLocation ) throw Error("No hay localización")

    this.isLoadingPlaces = true;
    
    this.placesApi.get<PlacesResponse>(`/${query}.json`,{
      params: {
        proximity: this.userLocation.join(',')
      }
    })
    .subscribe( resp => {

      //Se añaden los destacados en la búsqueda
      
      this.isLoadingPlaces=false;
      this.places = resp.features;


      this.mapService.createMarkerFromPlaces(this.places, this.userLocation!);
    }
      );
  }

  ocultarResultados(){
    //this.places=[]
  }

}
