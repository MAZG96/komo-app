import { Component, AfterViewInit, ViewChild, ElementRef, Inject, Input } from '@angular/core';
import {Map, Popup, Marker, AnySourceData} from 'mapbox-gl';
import { PlacesService } from '../../services/places.service';
import { MapService } from '../../services/map.service';
import { Properties } from '../../interfaces/place';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeComponent } from 'src/app/productos/pages/home/home.component';
import { InfoUsuarioService } from 'src/app/productos/services/info-usuario.service';
import mapboxgl from 'mapbox-gl';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv') 
  mapDivElement!: ElementRef;
  

  @ViewChild("popupContainer") popupContainer: any;


  @Input() centro_mapa!:[number,number];

  constructor(public router :Router,
    private placesService: PlacesService,
    private infoUsuarioService: InfoUsuarioService,
    private mapService: MapService,
    public dialogRef: MatDialogRef<HomeComponent>,
    private sharedService: SharedService
    ) { }


  ngAfterViewInit(): void {

    if(!this.centro_mapa){
      this.centro_mapa = [-5.99534, 37.38863];
    }
    
   

    const map = new Map({
      container: 'mapDiv', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      zoom: 5, // starting zoom
      interactive: true
      });

      map.on('load', () => {
        // Add a data source containing GeoJSON data.
        map.resize();

        
        if(this.centro_mapa){
          map.setCenter(this.centro_mapa)
          map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
          
            
            
            
        }
        
        /*map.addSource('maine', this.areaPunto([-6.088172, 36.338266]));
        
         
        // Add a new layer to visualize the polygon.

        //AÑADIR RADIO CON UN SOURCE QUE SE EDITE DINAMICAMENTE
        
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
        
        // Add a black outline around the polygon.
        
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

    
        
    this.infoUsuarioService.getInfoUsuarios()
        .subscribe(usuarios =>
          {
            
            
            for(let usuario of usuarios){
              const popupContent = document.createElement('div');
        popupContent.innerHTML = `<h3 style="text-align: center;">`+usuario.nombre_empresa+`</h3>`;

        const atag = document.createElement('div');
        atag.innerHTML = `<p style="text-align:center;">Ver productos</p>`
        popupContent.appendChild(atag); 
        atag.addEventListener('click', (e)=>{
          this.cerrar();
          this.sharedService.SetproductoId = Number(usuario.id_usuario);
          this.router.navigate(['/productos/productor/'])
        })
        

              const popup = new Popup()
              .setDOMContent(popupContent);
              
              var el = document.createElement('div');
              let foto = 'url('+usuario.foto+'), url("assets/productos/no-profile-image.png")';
              el.className = 'marker';
              el.style.backgroundImage = foto;
              el.style.backgroundSize = 'cover'
              el.style.backgroundPosition = 'center'
              el.style.backgroundRepeat = 'no-repeat'
              el.style.borderRadius = '50%'
              el.style.border = '1px solid black'
              el.style.boxShadow = '5px 5px 5px 0px rgba(0,0,0,0.75)'
              el.style.width = '50px';
              el.style.height = '50px';

              new mapboxgl.Marker(el)
              .setLngLat([Number(usuario.coord_x)+Math.random()*0.01, Number(usuario.coord_y)+Math.random()*0.01])
              .setPopup(popup)
              .addTo(map);
            }
          });

    




    

    this.mapService.setMap(map);
  }

  cerrar(){
    this.dialogRef.close();

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
