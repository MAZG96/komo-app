import { Injectable } from '@angular/core';
import { AnySourceData, LngLat, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/place';
import { DirectionsApiClient } from '../apis/directionsApiClient';
import { DirectionsResponse, Route } from '../interfaces/direction';
import { MapViewComponent } from '../components/map-view/map-view.component';



@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map: Map | undefined;
  private markers: Marker[] = [];

  get isMapReady(){
    return !!this.map;
  }

  constructor(private directionsApiClient: DirectionsApiClient){}

  setMap(map :Map){
    this.map= map;
  }

  flyTo(coords: LngLatLike){

    if(!this.isMapReady) throw Error("El Mapa no está inicializado");

    const newMarker = new Marker()
    .setLngLat(coords)
    .addTo( this.map! );
  

    
    this.map?.flyTo({
      zoom:11,
      center:coords
    });

  }

  e_radio(){
    this.map?.removeLayer('maine');
    this.map?.removeLayer('outline');
    this.map?.removeSource('maine');
    




    /*this.map?.addSource('maine', this.areaPunto([-3.703583,40.416705]));

    this.map?.addLayer({
      'id': 'maine',
      'type': 'fill',
      'source': 'maine', // reference the data source
      'layout': {},
      'paint': {
      'fill-color': '#0080ff', // blue color fill
      'fill-opacity': 0.5
      }
      });
    
    // Add a black outline around the polygon.
    
    this.map?.addLayer({
    'id': 'outline',
    'type': 'line',
    'source': 'maine',
    'layout': {},
    'paint': {
    'line-color': '#000',
    'line-width': 3
    }
    });

    this.flyTo([-3.703583,40.416705])*/
 
  }

  createMarkerFromPlaces( places: Feature[], userLocation :[number,number]){
    if ( !this.map ) throw Error('Mapa no inicializado');

    this.markers.forEach(marker => marker.remove);
    const newMarkers = [];

    //colocar marcadores de la búsqueda en el mapa

    for(const place of places){
      const[lng, lat] = place.center;
      const popup = new Popup()
        .setHTML(`
        <h6>${place.text}</h6>
        <span>${place.place_name_es}</span>
        `)
      /*const newMarker = new Marker()
        .setLngLat([lng,lat])
        .setPopup( popup )
        .addTo( this.map );
      
        newMarkers.push( newMarker);*/
    }

    //this.markers = newMarkers;

    //zoom inicial

    if ( places.length == 0){return;}

    /*const bounds = new LngLatBounds();
    newMarkers.forEach( marker => bounds.extend( marker.getLngLat() ));
    bounds.extend(userLocation);

    this.map.fitBounds(bounds, {
      padding:200
    })*/
  }

  getRouteBeetwenPoints(start: [number,number], end: [number,number]){
    this.directionsApiClient.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe(resp => this.DrawPolyline(resp.routes[0]));
  }

  //calcular la ruta y calcular distancia
  private DrawPolyline( route : Route){
    console.log({distancia: route.distance / 1000, duration: route.duration / 60});
    
    
    if( !this.map ) throw Error("Mapa no inicializado");
    const coords = route.geometry.coordinates;
    const start = coords[0];
    
    const bounds = new LngLatBounds();

    coords.forEach( ([lng , lat]) => {
      
      bounds.extend([lng,lat]);
    })
    
    this.map?.fitBounds(bounds, {
      padding:200
    });


    //trazar camino

    const sourceData: AnySourceData = {
      type: 'geojson',
      data:{
        type:'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }

    //Limpiar ruta previa
    if( this.map.getLayer('RouteString')){
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }


    //Trazar linea entre los puntos
    this.map.addSource('RouteString', sourceData);

    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout:{
        'line-cap':'round',
        'line-join':'round'
      },
      paint: {
        'line-color':'black',
        "line-width": 3
      }
    });


    
 
  }


  public areaPunto(ubicacion: [number,number]):AnySourceData{

    const points=64;

    var coords = {
      latitude: ubicacion[1],
      longitude: ubicacion[0]
    };

    var km = 10;

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

