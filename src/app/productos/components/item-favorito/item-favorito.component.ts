import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { Favorito } from '../../interfaces/favorito.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { ConfirmarComponent } from '../confirmar/confirmar.component';

@Component({
  selector: 'app-item-favorito',
  templateUrl: './item-favorito.component.html',
  styleUrls: ['./item-favorito.component.css']
})
export class ItemFavoritoComponent implements OnInit {


  @Input() favorito!: Favorito;

  icono_fav:string ="favorite"

  infoUser: Usuario = {
    id: '',
    nombre: '',
    nombre_empresa: '',
    ubicacion: '',
    coord_x: '',
    coord_y: '',
    foto: '',
    id_usuario: 0
  }

  constructor(private infoUsuarioService: InfoUsuarioService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private sharedService: SharedService,
              private router: Router) { }

  ngOnInit(): void {
    this.infoUsuarioService.getInfoUsuario(this.favorito.id_productor)
      .subscribe(infouser => {
        this.infoUser = infouser;
        
      }
        )
  }

  ir_productor(){
    this.sharedService.SetproductoId = Number(this.favorito.id_productor);
    this.router.navigate(['/productos/productor']);
    
  }

  
  borrar_favorito() {

    const dialog = this.dialog.open( ConfirmarComponent, {
      width: '250px',
      data: this.favorito
    });

    dialog.afterClosed().subscribe(
      (result) => {

        if( result ) {
          this.infoUsuarioService.borrarFavorito( this.favorito.id! )
            .subscribe( resp => {
              
              this.mostrarSnakbar('Favorito eliminado');
              
            });
        }
        
      }
    )

  }

  mostrarSnakbar( mensaje: string ) {

    this.snackBar.open( mensaje, 'ok!', {
      duration: 2500
    });

  }

}
