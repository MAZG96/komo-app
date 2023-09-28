import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { PagoStripeComponent } from '../../components/pago-stripe/pago-stripe.component';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Pedido } from '../../interfaces/pedidos.interface';
import { Producto } from '../../interfaces/productos.interface';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { CarritoComponent } from '../carrito/carrito.component';
import { AvisoPrivacidadComponent } from '../../components/aviso-privacidad/aviso-privacidad.component';

@Component({
  selector: 'app-info-pedido',
  templateUrl: './info-pedido.component.html',
  styleUrls: ['./info-pedido.component.css']
})
export class InfoPedidoComponent implements OnInit {

  provincias: string[] = ['Alava','Albacete','Alicante','Almería','Asturias','Avila','Badajoz','Barcelona','Burgos','Cáceres',
  'Cádiz','Cantabria','Castellón','Ciudad Real','Córdoba','La Coruña','Cuenca','Gerona','Granada','Guadalajara',
  'Guipúzcoa','Huelva','Huesca','Mallorca','Menorca','Ibiza','Jaén','León','Lérida','Lugo','Madrid','Málaga','Murcia','Navarra',
  'Orense','Palencia','Las Palmas','Pontevedra','La Rioja','Salamanca','Segovia','Sevilla','Soria','Tarragona',
  'Santa Cruz de Tenerife','Santander','Teruel','Toledo','Valencia','Valladolid','Vizcaya','Zamora','Zaragoza']

 

  confirma_email: string = "";

  checked: boolean = false;

  checkbox_politica: boolean = false;

  updateinfo!: boolean;

  cart!: ItemCarrito[];


  indices: number[] = [];


  constructor(private pedidoService:PedidosService,
              private snackBar:MatSnackBar,
              private router: Router,
              public dialog: MatDialog,
              private sharedService: SharedService,
              private authService: AuthService,
              private productoService: ProductosService) { }

  
  get usuario() {
    return this.authService.auth;
  }

  pedido:Pedido ={
    id: 0,
    nombre: '',
    apellidos: '',
    calle: '',
    piso: '',
    localidad: '',
    provincia: '',
    codigo_postal: '',
    telefono: '',
    email: '',
    total: this.pedidoService.calcularPrecioTotal(),
    id_usuario: this.authService.auth.id || 0,
  }

  infopedido !:Pedido;

  carro!:ItemCarrito[];
  

  ngOnInit(): void {

    if(!this.sharedService.Getcarro_compra){
      this.router.navigateByUrl("/productos/listado");
    }

    console.log(this.sharedService.Getcarro_compra)

    this.pedidoService.cart = JSON.parse(localStorage.getItem("cart")!) || [];

    this.cart = this.pedidoService.cart;

    if(this.pedidoService.cart.length == 0){
      this.router.navigate(['/productos/listado'])
    }

    if(localStorage.getItem("info-pedido")){
      this.pedido = JSON.parse(localStorage.getItem("info-pedido")!)
      this.confirma_email = this.pedido.email;
      this.pedido.total = this.pedidoService.calcularPrecioTotal();
    }else{

      if(this.usuario !== null){
      this.pedidoService.getInfoPedidosPorUsuario(this.usuario.id)
        .subscribe(infopedido => {
          if(infopedido){
            this.infopedido = {
              id: infopedido.id,
              nombre: infopedido.nombre,
              apellidos: infopedido.apellidos,
              calle: infopedido.calle,
              piso: infopedido.piso,
              codigo_postal: infopedido.codigo_postal,
              localidad: infopedido.localidad,
              provincia: infopedido.provincia,
              telefono: infopedido.telefono,
              email: infopedido.email,
              total: this.pedidoService.calcularPrecioTotal(),
              id_usuario: this.usuario.id,
          }   

            this.updateinfo = true;

            this.pedido = infopedido;

            this.confirma_email = this.pedido.email

            this.pedido.total = this.pedidoService.calcularPrecioTotal();
        }

        })
      }

    }
  }

  llamar_pago(){


    if( this.pedido.nombre.trim().length === 0  || this.pedido.apellidos.trim().length === 0
    || this.pedido.calle.trim().length === 0 || this.pedido.telefono.trim().length === 0
    || this.pedido.localidad.trim().length === 0
    || this.pedido.provincia.trim().length === 0 || this.pedido.codigo_postal.trim().length === 0
    || this.pedido.email.trim().length === 0) {
      this.mostrarSnakbar("Rellene los campos *")
      return;
    }

    
    if(this.pedido.piso.trim().length === 0){
      this.pedido.piso = ""
    }

    if(this.pedido.email != this.confirma_email){
      this.mostrarSnakbar("No coinciden los correos")
      return;
    }

    const esCP: RegExp = /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/;
    let OK = esCP.test(this.pedido.codigo_postal);

    if(!OK){
      this.mostrarSnakbar("Compruebe el Código Postal")
      return;
    }

    if((this.pedido.telefono[0] != "6" && this.pedido.telefono[0] != "7")  
    || this.pedido.telefono.trim().length != 9){
      this.mostrarSnakbar("Compruebe el Teléfono")
      return;
    }


    const esEmail: RegExp = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;


    OK = esEmail.test(this.pedido.email);

    if(!OK){
      this.mostrarSnakbar("Compruebe el Email")
      return;
    }

    if(!this.checkbox_politica){
      this.mostrarSnakbar("Acepte la Política de Privacidad")
      return;
    }

    localStorage.setItem("info-pedido",JSON.stringify(this.pedido))

    if(this.checked){
      this.comprobar_datos_guardados();
    }else{
      this.router.navigateByUrl('/productos/datos-pedido')
    }

  }

  comprobar_datos_guardados(){

    this.pedidoService.getInfoPedidosPorUsuario(this.usuario.id)
        .subscribe(infopedido => {
          if(infopedido){
            this.pedidoService.updateInfoPedido(this.pedido)
            .subscribe(ok => ok);
            console.log("uopdate")
    
          }else{
            this.pedidoService.agregarInfoPedido(this.pedido)
            .subscribe(ok => ok);
          }
        })

    this.router.navigateByUrl('/productos/datos-pedido')
  }

  



  prueba_seur(){
    //CREAR ENVIO PARA SEUR

    this.cart = JSON.parse(localStorage.getItem("cart")!) || [];

    this.cart.sort((a, b) => a.id_productor < b.id_productor ? -1 : a.id_productor > b.id_productor ? 1 : 0)

    for(let item of this.pedidoService.cart){
      if(item.recogida == 'envio'){
        this.indices.push(item.id_productor);
      } 
    }

    this.indices = this.indices.filter((item,index)=>{
      return this.indices.indexOf(item) === index;
    })

    this.cart = this.pedidoService.groupBy<ItemCarrito>(this.cart,"id_productor")

    for(let indice of this.indices){
      this.pedidoService.agregarPedidoSEUR(this.cart[indice])
        .subscribe(ok => console.log(ok))
    }

  }
  
  mostrarSnakbar( mensaje: string ) {

    this.snackBar.open( mensaje, 'ok!', {
      duration: 2500
    });

  }

  DialogDatos(): void {
    const dialogRef = this.dialog.open(AvisoPrivacidadComponent, {
      width: '400px',
      height: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      
      
    });
  }


}
