import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Categoria } from '../../interfaces/categoria.interfaces';
import { ListadoComponent } from '../../pages/listado/listado.component';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  

categorias!: Categoria[];



categoria!: Categoria;

constructor(private productosService: ProductosService,
  public dialogRef: MatDialogRef<ListadoComponent>,) { }

ngOnInit(): void {
  this.categorias = this.productosService.categorias;
  console.log(this.categorias)

}

recargar_zonas(){

}


elegir_categoria(){

  
  
  localStorage.setItem("categoria", JSON.stringify(this.categoria));

  this.dialogRef.close();

}



salir(){
  this.dialogRef.close();

}

}

