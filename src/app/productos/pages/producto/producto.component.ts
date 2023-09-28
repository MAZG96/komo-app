import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../interfaces/productos.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { PlacesResponse } from 'src/app/maps/interfaces/place';
import { PlacesService } from 'src/app/maps/services/places.service';
import { Categoria } from '../../interfaces/categoria.interfaces';
import { Favorito } from '../../interfaces/favorito.interface';
import { userInfo } from 'os';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styles: [`

  .header-usuario{
    width: 100%;
    vertical-align: middle;
    padding-top: 5px;
    position: fixed;
    top: 0;
    left:0;
    z-index: 10;
    padding-left: 20px;
    padding-right: 20px;

    background-color: white;
    justify-content: center;
    margin-top:55px;
  }

  .img-prod {
    object-fit: cover; /* no poner tamaño del width para que sea responsive*/
    height: 400px;
   
  }

  @media screen and (min-width: 768px) and  (max-width: 1024px){
    .header-usuario{
      width: 100%;
      vertical-align: middle;
      position: fixed;
      top: 4px;
      left:0;
      z-index: 10;
      padding-left: 20%;
      padding-right: 20%;
      padding-bottom: 5px;
      background-color: white;
      justify-content: center;
      margin-top:55px;
    }

    .img-prod {
      object-fit: cover; /* no poner tamaño del width para que sea responsive*/
      height: 500px;
     
    }

    .container{
      margin-top: -170px;
    }
  
  }

  @media screen and (min-width: 1024px){
    .header-usuario{
      width: 100%;
      vertical-align: middle;
      position: fixed;
      top: 4px;
      left:0;
      z-index: 10;
      padding-left: 30%;
      padding-right: 30%;
      padding-bottom: 5px;
      background-color: white;
      justify-content: center;
      margin-top:55px;
    }

    .img-prod {
      object-fit: cover; /* no poner tamaño del width para que sea responsive*/
      height: 500px;
    }

    .container{
      margin-top: 20px;
    }

  
  }
    

    ç
    .bar {
      --br-active-color: #17c9c9;
    }
    
    .star {
      --br-font-size: 34px;
      --br-active-color: #ed7b67;
      --br-inactive-color: #d2d2d2;
    }

    .btn-comprar{
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 1000;
      padding: 1em;
      background-color: transparent;
      justify-content: center;
      margin-bottom:55px;
  }

    .atributos{
      text-align:center;
    }

    .inline-icon {
      
    margin-top: 5px;
    margin-left: 5px; /* optional */
   }

    #boton-add-carro {
      position: fixed;
      bottom: 100px;
      width:95%;
      z-index: 1000;
      display: flex;
      justify-content: space-around;
      margin-top:200px;
      background-color: white;
      -webkit-box-shadow: 3px 3px 5px 6px #ccc;
      /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
      -moz-box-shadow: 3px 3px 5px 6px #ccc;
      /* Firefox 3.5 - 3.6 */
      box-shadow: 2px 2px 4px 5px #ccc;
      /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
    }

    mat-card-image{
    object-fit: cover;
    width: 80%;
    height: 100%;
    position: relative;
  }

  img{
    object-fit: cover; /* no poner tamaño del width para que sea responsive*/
    height: 300px;
  }


  .imagen-usuario{
    object-fit: cover; /* no poner tamaño del width para que sea responsive*/
    height: 80px;
    width: 80px;
    border-radius: 100px;
  }

  

  `]
})
export class ProductoComponent implements OnInit {

  categorias: Categoria[] =[];

  icono_fav:string = "favorite_outline"

  producto!: Producto;
  
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

  favorito :Favorito = {
    id: 0,
    id_usuario:0,
    id_productor: 0
  }

  horario_recogida: string[] =[]

  direccion_recogida: string = "";

  centro_mapa: [number,number] = [0,0];

  numero_productos: number = 0;

  constructor( private activatedRoute: ActivatedRoute,
               private productosService: ProductosService,
               private authService: AuthService,
               private infoUsuarioService: InfoUsuarioService,
               private placeService:PlacesService,
               private router: Router,
               private sharedService: SharedService,
               public location: Location) { }


  get usuario(){
    return this.authService.auth;
  }


  
  
  
  ngOnInit(): void {

    console.log(this.usuario);
    if(this.sharedService.GetproductoId  == 0){
      this.location.back();
    }

    
    this.productosService.getProductoPorId(""+this.sharedService.GetproductoId).pipe(
        switchMap(producto => 
          {
            return this.productosService.getProductoPorUsuario(producto.id_usuario).pipe()
          })
      ).subscribe(productos => this.numero_productos=productos.length);

    this.productosService.getProductoPorId(""+this.sharedService.GetproductoId).pipe(
        switchMap( producto => {
          this.producto = producto 
          this.sharedService.SetproductoId = producto.id_usuario;
            return this.infoUsuarioService.getInfoUsuario(producto.id_usuario).pipe(
            switchMap( user => {
              this.infoUser=user
      
              if(user.horario && user.calle && user.piso){
                this.horario_recogida = user.horario.split(',');
                this.direccion_recogida = user.calle+" , "+user.piso;
              }
      
              this.centro_mapa[0] = +this.infoUser.coord_x
              this.centro_mapa[1] = +this.infoUser.coord_y

              return this.infoUsuarioService.listarFavoritoUsuario(this.authService.auth.id).pipe(
                
              )
            })
          )
        })
      ).subscribe(favoritos => {
      for(let favorito of favoritos){
        if((favorito.id_productor == this.infoUser.id_usuario)){ //si mi usuario le ha dado favorito al vendedor icono lleno
          this.icono_fav = "favorite"
        }
      }

      
    });

      this.categorias = this.productosService.categorias

      /*this.productosService.getProductoPorId(id).pipe(
        switchMap( producto => {
          this.producto = producto 

          
          return this.infoUsuarioService.getInfoUsuario(producto.id_usuario)
        })
        
      ).subscribe(user => {
        this.infoUser=user

        this.centro_mapa[0] = +this.infoUser.coord_x
        this.centro_mapa[1] = +this.infoUser.coord_y

        console.log(this.centro_mapa)

      });*/

      /*this.infoUsuarioService.listarFavoritoUsuario(this.authService.auth.id)
        .subscribe(favoritos => {
          for(let favorito of favoritos){
            if((favorito.id_productor == this.infoUser.id_usuario)){ //si mi usuario le ha dado favorito al vendedor icono lleno
              this.icono_fav = "favorite"
              console.log(favorito)
            }
          }
        })*/

    

  }

  regresar() {
    this.router.navigate(['/productos/listado']);
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
