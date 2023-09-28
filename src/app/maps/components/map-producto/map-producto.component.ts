import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../../services/map.service';
import {Map, Popup, Marker, AnySourceData} from 'mapbox-gl';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-map-producto',
  templateUrl: './map-producto.component.html',
  styleUrls: ['./map-producto.component.css']
})
export class MapProductoComponent{

  @ViewChild('mapDiv') 
  mapDivElement!: ElementRef

  @Input() centro_mapa!:[number,number];

  constructor(
    private placesService: PlacesService,
    private mapService: MapService,
    ) { }


  ngAfterViewInit(): void {

    if(!this.centro_mapa){
      this.centro_mapa = [-3.70358,40.416705];
    }
    
   

    const map = new Map({
      container: 'mapDiv', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      zoom: 12, // starting zoom
      interactive: false
      });

      map.on('load', () => {
        // Add a data source containing GeoJSON data.
        map.resize();

        
        if(this.centro_mapa){
          map.setCenter(this.centro_mapa)

            map.addSource('maine', this.areaPunto(this.centro_mapa!));
            
            map.addLayer({
              'id': 'maine',
              'type': 'fill',
              'source': 'maine', // reference the data source
              'layout': {},
              'paint': {
              'fill-color': '#0080ff', // blue color fill
              'fill-opacity': 0.5
              }
              });
            
        }
        
        
         
        // Add a new layer to visualize the polygon.
        
        // Add a black outline around the polygon.
        /*
        map.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': 'maine',
        'layout': {},
        'paint': {
        'line-color': '#000',
        'line-width': 3
        }
        });*/
        });

    /*const popup = new Popup()
      .setHTML(`
        <h6>Aquí estoy</h6>
        <span>Estoy en este lugar del mundo</span>
      `);*/

    /*new Marker({color: 'red'})
      .setLngLat(this.placesService.userLocation)
      //.setPopup(popup)
      .addTo(map);*/

    this.mapService.setMap(map);
  }

  public areaPunto(ubicacion: [number,number]):AnySourceData{

    const points=64;

    var coords = {
      latitude: ubicacion[1],
      longitude: ubicacion[0]
    };

    var km = 0.5;

    var ret = [];
    var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
    var distanceY = km/110.574;

    var theta, x, y;

    for(var i=0; i<points; i++) {
        theta = (i/points)*(2*Math.PI);
        x = distanceX*Math.cos(theta);
        y = distanceY*Math.sin(theta);

        ret.push([coords.longitude+x, coords.latitude+y]);
    }
    ret.push(ret[0]);

    
    return {
      type: 'geojson',
      data:{
        type:'Feature',
        properties:{},
        geometry: 
            {
              type: 'Polygon',
              
              coordinates: [ret]
              
            }  
      }
    };
  
  }

  


    
  


}
