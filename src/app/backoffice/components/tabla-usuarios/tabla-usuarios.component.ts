import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/productos/interfaces/usuario.interface';
import { InfoUsuarioService } from 'src/app/productos/services/info-usuario.service';

@Component({
  selector: 'app-tabla-usuarios',
  templateUrl: './tabla-usuarios.component.html',
  styleUrls: ['./tabla-usuarios.component.css']
})
export class TablaUsuariosComponent implements OnInit {

  displayedColumns: string[] = ['nombre_empresa','ubicacion','ver'];
  dataSource!: MatTableDataSource<Usuario>;

  resultsLength!: number;

  usuarios!: Usuario[];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private infoUsuarioService: InfoUsuarioService) { }

  ngOnInit(): void { 
    this.infoUsuarioService.getInfoUsuarios()
    .subscribe(usuarios => {    
      this.usuarios = usuarios; 
      this.resultsLength = usuarios.length;
      this.dataSource = new MatTableDataSource<Usuario>(usuarios)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })

    
  }

}


