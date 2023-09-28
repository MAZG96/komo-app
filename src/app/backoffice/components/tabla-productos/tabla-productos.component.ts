import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from 'src/app/productos/interfaces/productos.interface';
import { ProductosService } from 'src/app/productos/services/productos.service';

@Component({
  selector: 'app-tabla-productos',
  templateUrl: './tabla-productos.component.html',
  styleUrls: ['./tabla-productos.component.css']
})
export class TablaProductosComponent implements OnInit {

  displayedColumns: string[] = ['foto','nombre', 'precio', 'stock', 'ver'];
  dataSource!: MatTableDataSource<Producto>;

  resultsLength!: number;

  productos!: Producto[];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productoService: ProductosService) { }

  ngOnInit(): void { 
    this.productoService.getProductos()
    .subscribe(productos => {    
      this.productos = productos; 
      this.resultsLength = productos.length;
      this.dataSource = new MatTableDataSource<Producto>(productos)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })

    
  }

}
