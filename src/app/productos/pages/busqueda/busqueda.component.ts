import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as turf from '@turf/turf'
import { Feature } from 'src/app/maps/interfaces/place';
import { MapSearchComponent } from 'src/app/maps/screens/map-search/map-search.component';
import { Categoria } from '../../interfaces/categoria.interfaces';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  categorias!: Categoria[];
  selectedCar!: string;
  categoria_elegida?: Categoria;
  lugar_elegido?: Feature;
  direc:string ="";



  constructor(private productoService:ProductosService,
              public dialog: MatDialog) { }

  ngOnInit(): void {

    this.categorias = this.productoService.categorias;

    if(localStorage.getItem("LOC")){
      this.lugar_elegido = JSON.parse(localStorage.getItem("LOC")!);
    }

  }

  seleccionar_categoria(categoria: Categoria): void {
    this.categoria_elegida = categoria;
    

  }

  borrar_ubicacion(): void {
    if(this.lugar_elegido){
      this.lugar_elegido = undefined;
      localStorage.removeItem("LOC")
    }

  }

  borrar_categoria(): void {
    if(this.categoria_elegida){
      this.categoria_elegida = undefined;

    }

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MapSearchComponent, {
      maxHeight: '100%',
      maxWidth: '100%',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: {lugar_elegido: this.lugar_elegido},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.lugar_elegido = result;
      if(localStorage.getItem("LOC") !== null){
        this.lugar_elegido = JSON.parse(localStorage.getItem("LOC")!);
        this.direc = this.lugar_elegido!.place_name;
        
        
      }
      
    });
  }

}
