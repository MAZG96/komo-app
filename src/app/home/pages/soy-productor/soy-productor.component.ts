import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { slideInAnimation } from 'animation';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Notificacion } from 'src/app/productos/interfaces/notificacion.interface';
import { Pedido } from 'src/app/productos/interfaces/pedidos.interface';
import { Producto } from 'src/app/productos/interfaces/productos.interface';
import { NotificacionService } from 'src/app/productos/services/notificacion.service';
import { PedidosService } from 'src/app/productos/services/pedidos.service';
import { ProductosService } from 'src/app/productos/services/productos.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-soy-productor',
  templateUrl: './soy-productor.component.html',
  styleUrls: ['./soy-productor.component.css'],
  animations: [
    slideInAnimation
  ]
})
export class SoyProductorComponent implements OnInit {

  activatedRoute: any;

  boton_notif: boolean = false;

  public readonly VALID_PUBLIC_KEY = 'BH5tNir_8CtqgFqUP7guHteWFBB6S_FO_T1WoTKz9cTST9vBBfsy9ae58u3Bfb34OR7EqP85ri5kLwRCgdAT25M';


  constructor(private authService: AuthService,
              private productosService: ProductosService,
              private pedidoService: PedidosService,
              private notificacionService: NotificacionService,
              private swPush: SwPush,
              private snackBar: MatSnackBar,
              private sharedService: SharedService,
              public router: Router) {
              }

  ngAfterViewInit(): void {
    this.goToNextTabIndex(this.demo3Tab);
  }

  subscribetoNotificactions(): any{

    this.swPush.requestSubscription({
      serverPublicKey: this.VALID_PUBLIC_KEY
    }).then(sub => {

      const token = JSON.parse(JSON.stringify(sub));

      //servicio al backend guardar token

      let notif: Notificacion = {
        endpoint: token.endpoint,
        expirationTime: null,
        keys: {
          p256dh: token.keys.p256dh,
          auth: token.keys.auth,
        },
        id_usuario: this.usuario.id        
      }

      console.log(notif)
      this.notificacionService.getNotificacion(this.usuario.id)
        .subscribe(notificacion => {

          
          if(notificacion){
            this.notificacionService.updateNotificacion(notif)
            .subscribe(notificacion => {
              this.mostrarSnakbar("Ya están activadas las notificaciones, te avisarán de tus próximas ventas")
            })

          }else{
            this.notificacionService.insertarNotificacion(notif)
            .subscribe(notificacion => {
              this.mostrarSnakbar("Acabas de activar las notificaciones, te avisarán de tus próximas ventas")
            })
          }
        })
    })

  }

  get usuario() {
    return this.authService.auth;
  }


  @ViewChild("demo3Tab", { static: false }) demo3Tab!: MatTabGroup;

  
  productos: Producto[] = [];

  pedidos: Pedido[] = []

  
  ngOnInit(): void {

    this.pedidoService.getPedidosPorUsuario(this.usuario.id)
    .subscribe( pedidos => {
      this.pedidos = pedidos });

    this.productosService.getProductoPorUsuario(this.usuario.id)
    .subscribe( productos => this.productos = productos );


    this.notificacionService.getNotificacion(this.usuario.id)
      .subscribe(notif => {
        if(notif){
          this.boton_notif = true;
        }
      })

    

  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/productos')
  }

  public demo3BtnClick() {
    
  }

  private goToNextTabIndex(tabGroup: MatTabGroup) {
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) { return;}
    
    const tabCount = tabGroup._tabs.length;
    tabGroup.selectedIndex = (this.sharedService.GetproductoId_back + 1) % tabCount;
  }

  ir_agregar_producto(){
    this.router.navigate(['./productos/agregar']);
  }

  volver(){
    
    this.router.navigate(['./']);
  }


  mostrarSnakbar( mensaje: string ) {

    this.snackBar.open( mensaje, 'ok!', {
      duration: 2500
    });

  }
  

}
