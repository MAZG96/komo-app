import { Component, Inject, OnInit } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { Feature } from '../../interfaces/place';
import { MapService } from '../../services/map.service';
import { Marker } from 'mapbox-gl';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeComponent } from 'src/app/productos/pages/home/home.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent{

  public selected_id :string = '';
  private debounceTimer?: NodeJS.Timeout;
  txt_ej: string ='';
  lugar_elegido!: Feature;
  coordenadas_cargadas: boolean = false;


  constructor(private placesService: PlacesService,
    private mapService: MapService ,
    public dialogRef: MatDialogRef<HomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Feature,) { }

  get isLoadingPlaces(){
    return this.placesService.isLoadingPlaces;
  }

  get places(){
    return this.placesService.places;
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  } 

  async flyTo( place: Feature){

    this.selected_id = place.id;
    this.txt_ej = place.place_name_es;
    const[lng, lat] = place.center;
    this.mapService.flyTo([lng, lat]);
    this.placesService.places =[];
    this.lugar_elegido=place;

    await this.delay(3000);
    this.coordenadas_cargadas = true;
  }

  editar_radio(){
    this.mapService.e_radio();
  }

  guardar_localizacion(){
    if(this.txt_ej != ''){
      localStorage.setItem("LOC",JSON.stringify(this.lugar_elegido))
      this.placesService.places =[];
    }
    this.dialogRef.close();
  }

  cerrar(){
    this.dialogRef.close();

  }

  getDirections( place: Feature){

    if(!this.placesService.userLocation)throw Error("No tenemos local");

    this.placesService.ocultarResultados();

    const start = this.placesService.userLocation!;
    const end = place.center as [number,number];

    

    this.mapService.getRouteBeetwenPoints(start,end);
  }

  onQueryChanged(query:string){
    if(this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout( () => {
      this.placesService.getPlacesByQuery(query)
     
    }, 1000);
  }

  onNoClick(): void {
    
  }
  

}
