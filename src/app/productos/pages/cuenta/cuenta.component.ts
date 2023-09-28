import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { Pedido } from '../../interfaces/pedidos.interface';
import { Producto } from '../../interfaces/productos.interface';
import { NotificacionService } from '../../services/notificacion.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { Notificacion } from '../../interfaces/notificacion.interface';


@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit,AfterViewInit {
  activatedRoute: any;

  public readonly VALID_PUBLIC_KEY = 'BH5tNir_8CtqgFqUP7guHteWFBB6S_FO_T1WoTKz9cTST9vBBfsy9ae58u3Bfb34OR7EqP85ri5kLwRCgdAT25M';


  constructor(private authService: AuthService,
              private productosService: ProductosService,
              private pedidoService: PedidosService,
              private notificacionService: NotificacionService,
              private swPush: SwPush,
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
              console.log("UPDATE notificacion")
            })

          }else{
            this.notificacionService.insertarNotificacion(notif)
            .subscribe(notificacion => {
              console.log("introducido notificacion")
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


}
