import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Favorito } from '../../interfaces/favorito.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit {

  favoritos!: Favorito[]

  constructor(private infoUsuarioService: InfoUsuarioService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.infoUsuarioService.listarFavoritoUsuario(this.authService.auth.id)
      .subscribe(favoritos => 
        {
          this.favoritos = favoritos;
        })
  }

}
