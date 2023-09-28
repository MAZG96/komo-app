import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Feature } from 'src/app/maps/interfaces/place';
import { MapService } from 'src/app/maps/services/map.service';
import { PlacesService } from 'src/app/maps/services/places.service';
import { InicioComponent } from '../../pages/inicio/inicio.component';

type NewType = PlacesService;

@Component({
  selector: 'app-barra-buscar',
  templateUrl: './barra-buscar.component.html',
  styleUrls: ['./barra-buscar.component.css']
})
export class BarraBuscarComponent implements OnInit{

  public selected_id :string = '';
  private debounceTimer?: NodeJS.Timeout;
  txt_ej: string ='';
  lugar_elegido!: Feature;
  coordenadas_cargadas: boolean = false;

  constructor(private placesService: PlacesService,
    private mapService: MapService) { }

  ngOnInit(): void {
    if(localStorage.getItem("LOC")){
      this.txt_ej = JSON.parse(localStorage.getItem("LOC")!).place_name;
    }
  }

  get isLoadingPlaces(){
    return this.placesService.isLoadingPlaces;
  }

  get places(){
    return this.placesService.places;
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  } 

  limpiar_barra(){
    localStorage.removeItem("LOC");
    this.txt_ej = "";

  }

  async flyTo( place: Feature){

    this.selected_id = place.id;
    this.txt_ej = place.place_name_es;
    const[lng, lat] = place.center;
    //this.mapService.flyTo([lng, lat]);
    this.placesService.places =[];
    this.lugar_elegido=place;
    this.coordenadas_cargadas = true;

    localStorage.setItem("LOC", JSON.stringify(place));
  }

  editar_radio(){
    this.mapService.e_radio();
  }

  guardar_localizacion(){
    if(this.txt_ej != ''){
      localStorage.setItem("LOC",JSON.stringify(this.lugar_elegido))
      this.placesService.places =[];
    }
    //this.dialogRef.close();
  }

  cerrar(){
    //this.dialogRef.close();

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
