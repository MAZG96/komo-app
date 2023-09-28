import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { Comentario } from '../../interfaces/comentario.interface';
import { Favorito } from '../../interfaces/favorito.interface';
import { Producto } from '../../interfaces/productos.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productor-lista',
  templateUrl: './productor-lista.component.html',
  styleUrls: ['./productor-lista.component.css']
})
export class ProductorListaComponent implements OnInit {

  productos: Producto[] = [];

  centro_mapa: [number,number] = [0,0]

  numero_productos: number = 0;

  comentarios!:Comentario[];

  infoUser!: Usuario;

  icono_fav:string = "favorite_outline"

  media_valoraciones: number = 0.0;

  favorito :Favorito = {
    id: 0,
    id_usuario:0,
    id_productor: 0
  }

  
  
  constructor( private productosService: ProductosService,
               private activatedRoute: ActivatedRoute,
               private infoUsuarioService: InfoUsuarioService,
               private authService: AuthService,
               private sharedService: SharedService,
               private router: Router) { }

  ngOnInit(): void {

        let id = this.sharedService.GetproductoId;
        this.productosService.getProductoPorUsuario(id).pipe(
            switchMap( productos => {
              this.numero_productos = productos.length;
              this.productos = productos 
              let id_usuario = 0;
              if(productos.length == 0){
                id_usuario=0;
              }else{
                id_usuario = productos[0].id_usuario;
              }
              return this.productosService.getComentariosProductor(id_usuario).pipe(
                switchMap( comentarios => {
                  this.comentarios = comentarios
                  let media :number = 0.0;
                  for(let i=0;i<this.comentarios.length;i++){
                    media += this.comentarios[i].valoracion;
                  }
                  this.media_valoraciones = media / this.comentarios.length;

                  return this.infoUsuarioService.getInfoUsuario(id).pipe(
                    switchMap(user => {
                      this.infoUser=user
              
                      this.centro_mapa[0] = +this.infoUser.coord_x
                      this.centro_mapa[1] = +this.infoUser.coord_y

                      return this.infoUsuarioService.listarFavoritoUsuario(this.authService.auth.id).pipe()
                    })
                    
                  )
                })
              )
            })
          )
        .subscribe(favoritos => {
          for(let favorito of favoritos){
            if((favorito.id_productor == this.infoUser.id_usuario)){ //si mi usuario le ha dado favorito al vendedor icono lleno
              this.icono_fav = "favorite"
            }
          }
        });
    
  }

  add_favorito(){

    if(this.icono_fav == "favorite"){
      this.infoUsuarioService.getFavoritoUsuarioProductor(this.authService.auth.id,this.infoUser.id_usuario).pipe(
        switchMap(favorito => {
            console.log(favorito)
            return this.infoUsuarioService.borrarFavorito(favorito.id!)   
        }
        )
      ).subscribe(resp => console.log(resp)) 
      this.icono_fav="favorite_outline"
    }else{
    
    this.favorito = {
      id_productor: this.infoUser.id_usuario,
      id_usuario: this.authService.auth.id,
    }
    this.infoUsuarioService.añadirFavorito(this.favorito)
      .subscribe(favorito => this.icono_fav="favorite");
  }
  }


 

}
