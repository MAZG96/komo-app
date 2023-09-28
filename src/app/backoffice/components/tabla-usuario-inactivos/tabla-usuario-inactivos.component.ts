import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Auth } from 'src/app/productos/interfaces/auth.interfaces';
import { InfoUsuarioService } from 'src/app/productos/services/info-usuario.service';

@Component({
  selector: 'app-tabla-usuario-inactivos',
  templateUrl: './tabla-usuario-inactivos.component.html',
  styleUrls: ['./tabla-usuario-inactivos.component.css']
})
export class TablaUsuarioInactivosComponent implements OnInit {

  displayedColumns: string[] = ['nombre_empresa','ubicacion','ver'];
  dataSource!: MatTableDataSource<Auth>;

  resultsLength!: number;

  usuarios!: Auth[];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private infoUsuarioService: InfoUsuarioService,
              private authService: AuthService) { }

  ngOnInit(): void { 

    this.recargar_lista();
    
  }


  recargar_lista(){
    this.authService.getUsuariosInactivos()
      .subscribe(usuarios => {

        this.usuarios = usuarios; 
        this.resultsLength = usuarios.length;
        this.dataSource = new MatTableDataSource<Auth>(usuarios)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      })
  }

  activar_cuenta(id:number){
    this.authService.activarCuenta(id)
      .subscribe(auth => 
        {
        console.log("activada");
        this.recargar_lista();

      }
        )

    this.usuarios = [];
  }

}


