import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { info } from 'console';
import { Subscription } from 'rxjs/internal/Subscription';
import { finalize, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ZonaService } from 'src/app/backoffice/services/zona.service';
import { Feature } from 'src/app/maps/interfaces/place';
import { MapSearchComponent } from 'src/app/maps/screens/map-search/map-search.component';
import { HorarioRecogidaComponent } from 'src/app/productos/components/horario-recogida/horario-recogida.component';
import { TextoFrioComponent } from 'src/app/productos/components/texto-frio/texto-frio.component';
import { TextoPagoRecogidaComponent } from 'src/app/productos/components/texto-pago-recogida/texto-pago-recogida.component';
import { TextoPopComponent } from 'src/app/productos/components/texto-pop/texto-pop.component';
import { TextoPuntoComponent } from 'src/app/productos/components/texto-punto/texto-punto.component';
import { TextoUbicacionComponent } from 'src/app/productos/components/texto-ubicacion/texto-ubicacion.component';
import { TextoZonaComponent } from 'src/app/productos/components/texto-zona/texto-zona.component';
import { Producto } from 'src/app/productos/interfaces/productos.interface';
import { Usuario } from 'src/app/productos/interfaces/usuario.interface';
import { Zona } from 'src/app/productos/interfaces/zona.interface';
import { InfoUsuarioService } from 'src/app/productos/services/info-usuario.service';
import { ProductosService } from 'src/app/productos/services/productos.service';
import { UPSService } from 'src/app/productos/services/ups.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-info-usuario',
  templateUrl: './info-usuario.component.html',
  styleUrls: ['./info-usuario.component.css']
})
export class InfoUsuarioComponent implements OnInit {

  lugar_elegido?: Feature;
  ej!: string[];
  horario: string[] = [];
  horario_zona: string[] = [];
  localidad: string = "";
  calle : string = "";
  prov: string  = "";
  prov_zona: string  = "";
  direc:string ="";
  url_foto:string ="";
  url_documento:string ="";


  productos: Producto[] = [];

  diasList = [
    { esp: 'Lunes', ing: 'Monday' },
    { esp: 'Martes', ing: 'Tuesday' },
    { esp: 'Miércoles', ing: 'Wednesday' },
    { esp: 'Jueves', ing: 'Thursday' },
    { esp: 'Viernes', ing: 'Friday' },
    { esp: 'Sábado', ing: 'Saturday' },
    { esp: 'Domingo', ing: 'Sunday' },
  ];

  zona: Zona = {
    id: 0,
    nombre: '',
    cp_inicio: '',
    direccion: '',
    horario: '',
    provincia: '',
    cp_fin: ''
  };


  zonas: Zona[] = [];
  usuario_creado!: boolean;
  apuntar_zona: boolean = false;
  codigo_postal_zona: string = "";
  envio_frio: boolean = false;


  cargado : boolean = false;

  provincias: string[] = ['Alava','Albacete','Alicante','Almería','Asturias','Avila','Badajoz','Barcelona','Burgos','Cáceres',
  'Cádiz','Cantabria','Castellón','Ciudad Real','Córdoba','La Coruña','Cuenca','Gerona','Granada','Guadalajara',
  'Guipúzcoa','Huelva','Huesca','Mallorca','Menorca','Ibiza','Jaén','León','Lérida','Lugo','Madrid','Málaga','Murcia','Navarra',
  'Orense','Palencia','Las Palmas','Pontevedra','La Rioja','Salamanca','Santander','Segovia','Sevilla','Soria','Tarragona',
  'Santa Cruz de Tenerife','Teruel','Toledo','Valencia','Valladolid','Vizcaya','Zamora','Zaragoza']

  private baseUrl: string = environment.base_url_pic;

  foto_subida: boolean = true;

  documento_subido: boolean = true;


  horas: string[] =[
    "7:00 - 8:00",
    "8:00 - 9:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
  ]

  horas_escogidas: string[] = [];
  



  get usuario() {
    return this.authService.auth;
  }

  user: Usuario = {
    id: '',
    nombre: '',
    nombre_empresa: '',
    ubicacion: '',
    coord_x: '',
    coord_y: '',
    foto: '',
    zona: 0,
    calle: '',
    piso: '',
    horario: '',
    recogida: 0,
    certificado: '',
    pregunta1: '',
    cp_envio: '',
    telefono_envio: '',
    pregunta2: '',
    dias_publicados: '',
    envio_frio: 0,
    envio_individual: 0,
    id_usuario: this.usuario.id
  }


  requiredFileType:string = "image/png";
  


    fileName = '';
    uploadProgress!:number;
    uploadSub!: Subscription;

  constructor(public dialog: MatDialog,
              private authService: AuthService,
              private infoUsuarioService: InfoUsuarioService,
              private http: HttpClient,
              private snackBar: MatSnackBar,
              private zonaService: ZonaService,
              private upsService: UPSService,
              private productoService: ProductosService,
              private router: Router,) { }

  

  ngOnInit(): void {

    this.productoService.getProductoPorUsuario(this.usuario.id)
      .subscribe(productos => {
        if(productos.length > 0){
          this.ej = productos[0].dias_publicados.split(',')
          this.productos = productos
        }
        
      })

      

    this.infoUsuarioService.getInfoUsuario( this.usuario.id ).pipe(

      switchMap( usuario => {
        
        if(usuario != null){
          this.user = usuario;

          if(usuario.dias_publicados){
            this.ej = usuario.dias_publicados.split(',')
          }
          
          if(usuario.calle){
            let direccion = this.user.calle!.split(',')

            this.calle = direccion[0].toString();
            this.localidad = direccion[1].toString();
            this.prov = direccion[2].toString().trim();
  
            
            this.horario = usuario.horario!.split(',');
          }

          if(this.user.envio_frio != 0){
            this.envio_frio = true;
          }

          if(this.user.zona != 0){
            this.apuntar_zona = true;
          }
          this.codigo_postal_zona = this.user.cp_envio!;
          this.direc = this.user.ubicacion;

          if(this.user.horario){
            this.horas_escogidas = this.user.horario.split(',');
          }
          
        }

        this.cargado = true;


        return this.zonaService.getZonaCP(this.user.cp_envio!).pipe(
          switchMap(zona =>{

            if(zona.id != 0){
              this.zona = zona;
              this.prov_zona = zona.provincia;
            }
            

            return this.zonaService.getZonasProvincia(this.prov_zona)
          }
            
            )
        )

      }
        )).subscribe(zonas => {
          this.zonas = zonas

        })

        this.recargar_zonas();
        
  }

  async subir_documento(event: any) {
    const file:File = event.target.files[0];
    this.documento_subido = false;


    if (file) {
        this.fileName = file.name;
        const formData = new FormData();
        formData.append("archivo", file);
        formData.append("nombre",""+this.usuario.uid);


        this.url_documento = ""+formData.get("nombre")+".pdf";

        
        console.log("hola")

        const upload$ = this.http.post(`${ this.baseUrl }/api/info-usuario/documento`, formData, {
            reportProgress: true,
            observe: 'events'
        })
        .pipe(
            finalize(() => {
              
              this.user.certificado = `${environment.path_node}/documentacion/`+this.url_documento;

              this.infoUsuarioService.actualizarDocURL(this.user.certificado,this.user.id).subscribe(user=>this.mostrarSnakbar('Documento subido'))
              this.reset_doc()
            })
        );
      
        this.uploadSub = upload$.subscribe(event => {
          if (event.type == HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * (event.loaded / event.total!));
          }
        })

    }
  }

  

  reset_doc() {
    this.uploadProgress = 0;
    this.documento_subido = true;
    this.uploadSub = new Subscription();
  }

  cancelUpload_doc() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  async onFileSelected(event: any) {
    const file:File = event.target.files[0];
    this.foto_subida = false;


    if (file) {
        this.fileName = file.name;
        const formData = new FormData();
        formData.append("archivo", file);
        formData.append("nombre",""+this.usuario.uid+Date.now());


        this.url_foto = ""+formData.get("nombre")+".jpg";

        

        const upload$ = this.http.post(`${ this.baseUrl }/upload/user`, formData, {
            reportProgress: true,
            observe: 'events'
        })
        .pipe(
            finalize(() => {
              
              this.user.foto= `${environment.path_node}/profile/`+this.url_foto;
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



  reset() {
    this.uploadProgress = 0;
    this.foto_subida = true;
    this.uploadSub = new Subscription();
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
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
        localStorage.removeItem("LOC")
      }
      
    });
  }

  DialogZonaConil(): void {
    const dialogRef = this.dialog.open(TextoZonaComponent , {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  DialogPunto(): void {
    const dialogRef = this.dialog.open(TextoPuntoComponent , {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  DialogPago(): void {
    const dialogRef = this.dialog.open(TextoPagoRecogidaComponent , {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  DialogFrio(): void {
    const dialogRef = this.dialog.open(TextoFrioComponent , {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  DialogUbicacion(): void {
    const dialogRef = this.dialog.open(TextoUbicacionComponent , {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  





  guardar_usuario() {
  
    if( this.user.nombre === null || this.user.nombre_empresa === null|| this.direc === null || this.user.telefono_envio === null || this.user.cp_envio == null ) {
      this.mostrarSnakbar("Rellene los campos *")
      return;
    }

    if((this.user.telefono_envio![0] != "6" && this.user.telefono_envio![0] != "7")  
      || this.user.telefono_envio!.trim().length != 9){
        this.mostrarSnakbar("Compruebe el Teléfono")
        return;
      }

    this.user.horario = this.horas_escogidas.toString()

    const esCP: RegExp = /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/;
    let OK = esCP.test(this.user.cp_envio);

      if(Number(this.user.cp_envio) < 999 || Number(this.user.cp_envio) > 53000){
        this.mostrarSnakbar("Compruebe el Código Postal")
        return;
      }

      if(this.direc == ""){
        this.mostrarSnakbar("Elija la ubicación de sus productos")
        return;
      }

    if ( this.user.id ) {
      // Actualizar
      this.user.ubicacion = this.direc.toString(); 
      if(this.lugar_elegido != null ){
        this.user.coord_x = ""+this.lugar_elegido!.geometry.coordinates[0];
        this.user.coord_y = ""+this.lugar_elegido!.geometry.coordinates[1];
      }
      this.infoUsuarioService.actualizarInfoUsuario( this.user )
        .subscribe( producto => this.mostrarSnakbar('Registro actualizado'));

    } else {
      // Crear
      this.user.ubicacion = this.direc.toString(); 
      if(this.lugar_elegido != null ){
        this.user.coord_x = ""+this.lugar_elegido!.geometry.coordinates[0];
        this.user.coord_y = ""+this.lugar_elegido!.geometry.coordinates[1];
      }
      this.infoUsuarioService.agregarInfoUsuario( this.user )
        .subscribe( user => {
          this.mostrarSnakbar('Registro creado');
          this.usuario_creado = true;
          this.user = user;
        })
    }

    this.codigo_postal_zona = this.user.cp_envio;
    this.recargar_zonas();

  }

  guardar_zona(){

    if(this.apuntar_zona){
      this.user.zona = this.zona.id;
      this.user.envio_frio = 0;
      this.user.recogida = 0;
      this.user.envio_individual = 0;
      this.envio_frio = false;
    }else{
      this.user.zona = 0;
    }

      this.user.calle = this.calle+","+this.localidad+","+this.prov;
      this.infoUsuarioService.actualizarInfoUsuario( this.user )
          .subscribe( producto => this.mostrarSnakbar('Registro actualizado'));
    

  }

  guardar_recogida(){

    
    console.log(this.user)
    console.log(this.prov)
    console.log(this.localidad)

    if( this.user.recogida == 1) {

      if( this.calle!.trim() == "" || this.horario[0].length == 0 || this.prov!.trim() == "" || this.localidad!.trim() == "") {
        this.mostrarSnakbar("Rellene los datos del punto de recogida*")
        return;
      }
    }else{

    this.user.calle = this.calle+","+this.localidad+","+this.prov;

    this.user.horario = this.horario.toString();

      // Actualizar
      this.user.ubicacion = this.direc.toString(); 
      if(this.lugar_elegido != null ){
        this.user.coord_x = ""+this.lugar_elegido!.geometry.coordinates[0];
        this.user.coord_y = ""+this.lugar_elegido!.geometry.coordinates[1];
      }

      this.user.zona = 0;
      this.user.envio_frio = 0;
      this.user.envio_individual = 0;
      this.apuntar_zona = false;
    }

    this.user.calle = this.calle+","+this.localidad+","+this.prov;
      this.infoUsuarioService.actualizarInfoUsuario( this.user )
        .subscribe( producto => this.mostrarSnakbar('Registro actualizado'));

  }

  guardar_individual(){



    if( this.user.envio_individual == 1) {

          

      if( this.calle.trim() == '' || this.prov.trim() == '' || this.localidad.trim() == '') {
        this.mostrarSnakbar("Rellene los datos para el envío individual")
        return;
      }
    }

    if( this.user.envio_individual == 0) {

      if( this.calle!.trim() == ""  || this.prov!.trim() == "" || this.localidad!.trim() == "") {
        this.mostrarSnakbar("Rellene los datos para el envío individual*")
        return;
      }
    }else{

    this.user.calle = this.calle+","+this.localidad+","+this.prov;


      // Actualizar
      this.user.ubicacion = this.direc.toString(); 
      if(this.lugar_elegido != null ){
        this.user.coord_x = ""+this.lugar_elegido!.geometry.coordinates[0];
        this.user.coord_y = ""+this.lugar_elegido!.geometry.coordinates[1];
      }

      this.user.zona = 0;
      this.user.envio_frio = 0;
      this.user.recogida = 0;
      this.apuntar_zona = false;
    }

      this.user.calle = this.calle+","+this.localidad+","+this.prov;

      this.infoUsuarioService.actualizarInfoUsuario( this.user )
        .subscribe( producto => this.mostrarSnakbar('Registro actualizado'));

  }


  guardar_frio(){

    if( this.user.envio_frio == 1) {

      if( this.calle!.trim() == ""  || this.prov!.trim() == "" || this.localidad!.trim() == "") {
        this.mostrarSnakbar("Rellene los datos para el envío refrigerado*")
        return;
      }
    }

    if( this.user.envio_frio == 0) {

      if( this.calle!.trim() == ""  || this.prov!.trim() == "" || this.localidad!.trim() == "") {
        this.mostrarSnakbar("Rellene los datos para el envío refrigerado*")
        return;
      }
    }else{

    this.user.calle = this.calle+","+this.localidad+","+this.prov;

      // Actualizar
      this.user.ubicacion = this.direc.toString(); 
      if(this.lugar_elegido != null ){
        this.user.coord_x = ""+this.lugar_elegido!.geometry.coordinates[0];
        this.user.coord_y = ""+this.lugar_elegido!.geometry.coordinates[1];
      }

      this.user.zona = 0;
      this.user.recogida = 0;
      this.user.envio_individual = 0;
      this.apuntar_zona = false;
    }

    this.user.calle = this.calle+","+this.localidad+","+this.prov;
      this.infoUsuarioService.actualizarInfoUsuario( this.user )
        .subscribe( producto => this.mostrarSnakbar('Registro actualizado'));

  }

  guardar_infoenvio(){


      if( this.user.certificado == null || this.user.pregunta2 == null || this.user.pregunta1 == null ) {
        this.mostrarSnakbar("Rellene los datos de envío*")
        return;
      }

      if( this.user.certificado!.trim() == "" || this.user.pregunta2!.trim() == "" || this.user.pregunta1!.trim() == "") {
        this.mostrarSnakbar("Rellene los datos de envío*")
        return;
      }

      if(this.envio_frio){ // si activa el frío no se cancela unificar
        this.user.zona = 0;
        this.apuntar_zona = false;
        this.user.envio_frio = 1;
      }

      this.infoUsuarioService.actualizarInfoUsuario( this.user )
        .subscribe( producto => this.mostrarSnakbar('Registro actualizado'));

  }

  DialogHorarios(): void {
    const dialogRef = this.dialog.open(HorarioRecogidaComponent, {
      maxHeight: 'calc(100% - 32px)',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'full-screen-modal',
      data: {horario: this.horario},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.horario = result;
      
        this.infoUsuarioService.getInfoUsuario( this.usuario.id )
          .subscribe(usuario => {
            if(usuario){
              this.horario = usuario.horario!.split(',');
            }
          }
            
            )
      }
      
      
    );
  }

  recargar_zonas(){

    this.zona = {
      id: 0,
      nombre: '',
      cp_inicio: '',
      direccion: '',
      horario: '',
      provincia: '',
      cp_fin: ''
    };

    this.horario_zona = [];
    this.zonaService.getZonaCP(this.codigo_postal_zona!)
      .subscribe(zona=> {
          if(zona){
            this.zona = zona
          }
        })
  }


  
  get_zona(){

    
    this.upsService.access_point('CONIL DE LA FRONTERA')
      .subscribe(respuesta => {
        console.log(respuesta)
      })

      
    this.zonaService.getZona(this.zona.id)
      .subscribe(zona=> {
          if(zona){
            this.zona = zona;
            
          }else{
            this.zona.id = 0;
            console.log(zona)
          }
         
        })
    
  }

  mostrarSnakbar( mensaje: string ) {

    this.snackBar.open( mensaje, 'ok!', {
      duration: 2500
    });

  }

  DialogEnvio(i:number): void {
    const dialogRef = this.dialog.open(TextoPopComponent, {
      maxHeight: 'calc(100% - 32px)',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'full-screen-modal',
      data: "Decide con cuidado en qué días deseas que tus productos estén disponibles para su visualización/compra, ya que al día siguiente deberás llevarlos al punto de consolidación de KOMO (si te has registrado en Unificar) o permitir que la empresa de transporte recoja tus ventas (si te has registrado en transporte). Puedes modificar estos días en cualquier momento, siempre y cuando no hayas recibido ya una compra. En caso de que no puedas entregar tu paquete o no puedas esperar a la empresa de transporte, avísanos lo antes posible para que podamos cancelar la venta. No será posible programar la entrega o recolección de la venta en otro día.",
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }


  DialogDocumento(i:number): void {
    const dialogRef = this.dialog.open(TextoPopComponent, {
      maxHeight: 'calc(100% - 32px)',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'full-screen-modal',
      data: `El número de REGEPA (Registro General de la producción agrícola). Todo agricultor profesional lo tiene.
      Autónomo régimen agrario o documentación que acredite como facturan las ventas de sus productos.
      Inscripción en sistema de la comunidad autónoma correspondiente para poder ejercer la venta directa.
      Registro sanitario en caso de cosméticos y alimentos manipulados.
      Certificado eco cuando se ofrece como ecologico.`
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  DialogVenta(texto:string): void {
    const dialogRef = this.dialog.open(TextoPopComponent, {
      maxHeight: 'calc(100% - 32px)',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'full-screen-modal',
      data: texto
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  desactivar_venta(){

    this.infoUsuarioService.getInfoUsuario( this.usuario.id ).pipe(
      switchMap(infouser => {

          infouser.envio_frio = 0;
          infouser.envio_individual = 0;
          infouser.recogida = 0;
          infouser.zona = 0;

        return this.infoUsuarioService.actualizarInfoUsuario(infouser)
      }))
      .subscribe(infouser => {

        this.user.envio_frio = 0;
        this.user.envio_individual = 0;
        this.user.recogida = 0;
        this.user.zona = 0;
        
        this.mostrarSnakbar("¡Métodos de Venta desactivados!")
      })

  }

  cambiar_dias(){
    
    this.user.dias_publicados = this.ej.toString();

    this.infoUsuarioService.actualizarInfoUsuario(this.user)
      .subscribe(user=> user);


    this.productoService.getProductoPorUsuario(this.usuario.id)
      .subscribe(productos =>{

        for(let producto of productos){

          producto.dias_publicados = this.ej.toString();
          this.productoService.actualizarProducto(producto)
            .subscribe(producto => producto)
        
        }

      })

      this.mostrarSnakbar("Registro Actualizado");

  }
}
