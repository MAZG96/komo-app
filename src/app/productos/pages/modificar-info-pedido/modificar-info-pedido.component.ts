import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Pedido } from '../../interfaces/pedidos.interface';

@Component({
  selector: 'app-modificar-info-pedido',
  templateUrl: './modificar-info-pedido.component.html',
  styleUrls: ['./modificar-info-pedido.component.css']
})
export class ModificarInfoPedidoComponent implements OnInit {

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
    total: 0,
    id_usuario: this.authService.auth.id || 0,
  }

  confirma_email!: string;

  provincias: string[] = ['Alava','Albacete','Alicante','Almería','Asturias','Avila','Badajoz','Barcelona','Burgos','Cáceres',
  'Cádiz','Cantabria','Castellón','Ciudad Real','Córdoba','La Coruña','Cuenca','Gerona','Granada','Guadalajara',
  'Guipúzcoa','Huelva','Huesca','Mallorca','Menorca','Ibiza','Jaén','León','Lérida','Lugo','Madrid','Málaga','Murcia','Navarra',
  'Orense','Palencia','Las Palmas','Pontevedra','La Rioja','Salamanca','Segovia','Sevilla','Soria','Tarragona',
  'Santa Cruz de Tenerife','Santander','Teruel','Toledo','Valencia','Valladolid','Vizcaya','Zamora','Zaragoza']

  constructor(private authService: AuthService,
              public router: Router,
              private snackBar:MatSnackBar,
              public dialogRef: MatDialogRef<ModificarInfoPedidoComponent>

              ) { }

  ngOnInit(): void {

    this.pedido = JSON.parse(localStorage.getItem("info-pedido")!);

    if(this.pedido === null){
      this.router.navigateByUrl("productos/listado");
    }

    this.confirma_email = this.pedido.email;
  }

  guardar_infopedido(){
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

    localStorage.setItem("info-pedido",JSON.stringify(this.pedido));
    
    this.mostrarSnakbar("Información del pedido guardada");

    this.dialogRef.close();
  }

  mostrarSnakbar( mensaje: string ) {

    this.snackBar.open( mensaje, 'ok!', {
      duration: 2500
    });

  }

  cerrar(){
    this.dialogRef.close();
  }

}
