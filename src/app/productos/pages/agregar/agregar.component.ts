import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, finalize, switchMap } from 'rxjs/operators';



import { Producto } from '../../interfaces/productos.interface';
import { ProductosService } from '../../services/productos.service';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { HttpClientModule, HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FormControl } from '@angular/forms';
import { timeStamp } from 'console';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { InfoUsuarioService } from '../../services/info-usuario.service';
import { TextocomprobardatosComponent } from '../../components/textocomprobardatos/textocomprobardatos.component';
import { IfStmt } from '@angular/compiler';
import { ElegirPesoComponent } from '../../components/elegir-peso/elegir-peso.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    
    .file-input {
    display: none;
    }
    mat-card-image{
    object-fit: cover;
    width: 80%;
    height: 100%;
    position: relative;
  }

  .cantidad{
    width: 100%;
    display: flex;
  }

  @media screen and (max-width: 600px) {
    .no-movil-dias{
      display:none;
    }
  
  }

  .upload-btn{
  
    object-fit: cover; /* no poner tamaño del width para que sea responsive*/
    height: 130px;
    -webkit-box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.19); 
    box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.19);
  }

  @media screen and (min-width: 768px) and  (max-width: 1024px){
    .container{
        padding-left: 20%;
      padding-right: 20%;
    }

    .upload-btn{
  
      object-fit: cover; /* no poner tamaño del width para que sea responsive*/
      height: 300px;
      -webkit-box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.19); 
      box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.19);
    }

    .subir-imagen{
      padding: 20px;
    }

    .movil-dias{
      display:none;
    }

}

@media screen and (min-width: 1024px){

    .container{
        padding-left: 30%;
      padding-right: 30%;
    }

    .upload-btn{
  
      object-fit: cover; /* no poner tamaño del width para que sea responsive*/
      height: 300px;
      -webkit-box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.19); 
      box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.19);
    }

    .subir-imagen{
      padding: 20px;
    }

    .movil-dias{
      display:none;
    }

}

  `]
})
export class AgregarComponent implements OnInit {

  

  ej: string[] = [];

  private baseUrl: string = environment.base_url_pic;


  foto_subida: boolean = true;

  get usuario() {
    return this.authService.auth;
  }

  selected!: string;

  dias_semana = new FormControl();

  precio_producto!: number;

  cantidad!: number;


  diasList = [
    { esp: 'Lunes', ing: 'Monday' },
    { esp: 'Martes', ing: 'Tuesday' },
    { esp: 'Miércoles', ing: 'Wednesday' },
    { esp: 'Jueves', ing: 'Thursday' },
    { esp: 'Viernes', ing: 'Friday' },
    { esp: 'Sábado', ing: 'Saturday' },
    { esp: 'Domingo', ing: 'Sunday' },
  ];

  categorias!: {id:number,text:string}[];

  unidades!: {id:number,text:string}[];

  unidad: {id:number,text:string} = {
    id: 0,
    text: 'kg'
  }


  public res!: { [key: string]: any };
  


  url_foto = '';


  producto: Producto = {
    id: '',
    nombre: '',
    descripcion: '',
    dias_publicados: '',
    precio: 1,
    cantidad: '',
    peso_total: 1,
    stock: 0,
    foto: '',
    id_categoria: 0,
    id_usuario: this.usuario.id
  }



  requiredFileType:string = "image/*";


    fileName = '';
    uploadProgress:number = 0;
    uploadSub!: Subscription;

  constructor( private productosService: ProductosService,
               private activatedRoute: ActivatedRoute,
               private authService: AuthService,
               private http: HttpClient,
               public location: Location,
               private router: Router,
               private snackBar: MatSnackBar,
               private infoUsuarioService: InfoUsuarioService,
               private sharedService: SharedService,
               public dialog: MatDialog ) { }

  ngOnInit(): void {

    this.categorias = this.productosService.categorias;

    this.unidades = this.productosService.unidades;
    

    this.infoUsuarioService.getInfoUsuario(this.usuario.id)
      .subscribe(usuario => {
        if(usuario.dias_publicados){
          this.ej = usuario.dias_publicados.split(',');
        }
      })
    

    this.infoUsuarioService.getInfoUsuario(this.usuario.id)
      .subscribe(info => {

        if(!info){
          this.DialogDatos();
          return;
        } 


        if(info.nombre.trim() == "" || info.nombre_empresa.trim() == "" || info.ubicacion.trim() == ""){
          this.DialogDatos();
        }

        
      })

    
    if( !this.router.url.includes('editar') ) {
      return;
    }

    if(this.sharedService.GetproductoId){
    this.productosService.getProductoPorId( ""+this.sharedService.GetproductoId )
        .subscribe( producto => {
          this.precio_producto = producto.precio;
          this.cantidad = Number(producto.cantidad.split(' ')[0]);
          this.unidad = { 
            id: 0,
            text: producto.cantidad.split(' ')[1]
          }
          this.producto = producto;
          this.ej = this.producto.dias_publicados.split(',');
          console.log(this.producto)
        
        }
          );
        }

    this.sharedService.SetproductoId_back = 0;
      
  }


    async onFileSelected(event: any) {


        const file:File = event.target.files[0];     
        this.foto_subida = false;
        
        if (file) {
            this.fileName = file.name;
            console.log(file);
            
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                console.log(reader.result);
                console.log(file);
            };

            const formData = new FormData();
            formData.append("archivo", file);
            formData.append("nombre",""+this.usuario.uid+Date.now());

            console.log(formData);

            this.url_foto = ""+formData.get("nombre")+".jpg";

            

            const upload$ = this.http.post(`${ this.baseUrl }/upload`, formData, {
                reportProgress: true,
                observe: 'events'
            })
            .pipe(
                finalize(() => {
                  
                  this.producto.foto= `${environment.path_node}`+this.url_foto;
                  this.reset()
                })
            );
          
            this.uploadSub = upload$.subscribe(event => {
              if (event.type == HttpEventType.UploadProgress) {
                this.uploadProgress = Math.round(100 * (event.loaded / event.total!));
              }
            })

        }
    }

  

  
    

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = 0;
    this.foto_subida = true;
    this.uploadSub = new Subscription();
  }

  DialogDatos(): void {
    const dialogRef = this.dialog.open(TextocomprobardatosComponent, {
      width: '250px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  guardar() {

  
    this.producto.cantidad = this.cantidad+" "+this.unidad.text;

    if( this.producto.nombre.trim().length === 0  || this.producto.descripcion.trim().length === 0 
    || this.producto.precio === null || this.producto.peso_total === null || this.producto.stock === null || this.producto.cantidad.trim().length === 0 ) {
      this.mostrarSnakbar("Rellene los campos *")
      return;
    }

    

    if( this.producto.peso_total > 0,0 ) {
      this.mostrarSnakbar("Kg por unidad mínimo 0,1")
      return;
    }


    if( this.producto.foto.trim().length === 0) {
      this.mostrarSnakbar("Suba una foto del producto *")
      return;
    }

    

    const esCP: RegExp = new RegExp("[0-9,]+[^.]");

    if(this.precio_producto.toString().includes('.')){
      if(this.precio_producto.toString().split('.')[1].length > 2){
        this.mostrarSnakbar("Compruebe el formato del precio");
        return;
      }
    }

    if(this.producto.peso_total.toString().includes('.')){
      if(this.producto.peso_total.toString().split('.')[1].length > 2){
        this.mostrarSnakbar("Compruebe el formato de los kg/ud");
        return;
      }
    }

    
      this.producto.precio = Number(this.precio_producto);
    
    

    if( this.producto.precio < 0.50 || this.producto.precio > 2500 ) {
      this.mostrarSnakbar("Precio mínimo 0,50€ hasta 2500€")
      return;
    }
    

    if ( this.producto.id ) {
      // Actualizar
      this.producto.dias_publicados = this.ej.toString(); 
      this.productosService.actualizarProducto( this.producto )
        .subscribe( producto => this.mostrarSnakbar('Registro actualizado'));

    } else {
      // Crear
      this.producto.dias_publicados = this.ej.toString(); 
      this.productosService.agregarProducto( this.producto )
        .subscribe( producto => {
          this.router.navigate(['/productos/cuenta']);
          this.mostrarSnakbar('Registro creado');
        })
    }

  }



  borrarproducto() {

    const dialog = this.dialog.open( ConfirmarComponent, {
      width: '250px',
      data: this.producto
    });

    dialog.afterClosed().subscribe(
      (result) => {

        if( result ) {
          this.productosService.borrarProducto( this.producto.id! )
            .subscribe( resp => {
              this.location.back()
            });
        }
        
      }
    )

  }


  elegir_peso() {

    const dialog = this.dialog.open( ElegirPesoComponent, {
      width: '300px',
      data: this.producto.peso_total
    });

    dialog.afterClosed().subscribe(
      (result) => {


        console.log(result);
        if( result ) {
          this.producto.peso_total = result;
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

  


