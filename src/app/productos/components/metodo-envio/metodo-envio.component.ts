import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { ResumenPedidoComponent } from '../../pages/resumen-pedido/resumen-pedido.component';
import { InfoUsuarioService } from '../../services/info-usuario.service';

@Component({
  selector: 'app-metodo-envio',
  templateUrl: './metodo-envio.component.html',
  styleUrls: ['./metodo-envio.component.css']
})
export class MetodoEnvioComponent implements OnInit {

  metodo_recogida!: boolean;
  metodo_envio!: boolean;
  cart!: ItemCarrito[];
  dias_semana!: string;
  horas: string[] = [];

  cargado: boolean = false;

  horario_elegido: string = "";

  nombre_empresa!: string;

  pago_en_recogida!: number;


  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: Usuario,
              private infoUsuarioService: InfoUsuarioService,
              public dialogRef: MatDialogRef<ResumenPedidoComponent>,
              ) { }

  async ngOnInit() {

    console.log(this.data);
    this.cart = JSON.parse(localStorage.getItem("cart")!) || [];

    for(let item of this.cart){

      if(item.id_productor == this.data.id_usuario){
        if(item.recogida != 'envio'){ // metodo elegido recogida
          this.horario_elegido = item.recogida!;
          this.metodo_envio = false;
        }else{                        //metodo elegido envio
          this.metodo_envio = true;
        }
      }
      
    }

    this.infoUsuarioService.getInfoUsuario(this.data.id_usuario)
      .subscribe(usuario => {

        if(usuario.recogida == 0){
          this.metodo_recogida = false;
        }else{
          this.metodo_recogida = true;
        }
        this.nombre_empresa = usuario.nombre_empresa;

        this.pago_en_recogida = usuario.pago_recogida!;

        let horarios = usuario.horario!.split(',');

        for(let item of horarios){
          this.dias_semana = item.split(' ')[0].toString(); //Lunes
          let horas_dia = item.split(' ')[1].split(';');
          for(let it of horas_dia){
            this.horas.push(this.dias_semana+" "+it); //13:30-12:00            
          }
        }

      })

      await this.infoUsuarioService.delay(1000)

      this.cargado = true;


  }

  asignar_metodo_recogida(){

    this.cart = JSON.parse(localStorage.getItem("cart")!) || [];

    for(let item of this.cart){

      if(item.id_productor == this.data.id_usuario){
        item.pago_recogida = this.data.pago_recogida;
        item.recogida = this.horario_elegido;
        let index = this.cart.indexOf(item)
        this.cart[index] = item;
      }
      

    }

    localStorage.setItem("cart",JSON.stringify(this.cart))

    this.dialogRef.close();

  }

  asignar_metodo_envio(){

    this.cart = JSON.parse(localStorage.getItem("cart")!) || [];

    for(let item of this.cart){

      if(item.id_productor == this.data.id_usuario){
        item.pago_recogida = 0;
        item.recogida = 'envio'
        let index = this.cart.indexOf(item)
        this.cart[index] = item;
      }
      
    }

    localStorage.setItem("cart",JSON.stringify(this.cart))

    this.dialogRef.close();

  }

  envio(){
    this.metodo_envio = true;
  }

  recogida(){
    this.metodo_envio = false;
  }

}
