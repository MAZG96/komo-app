import { AfterViewInit, Component, ElementRef, Inject, Input, NgZone, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';
import { Pedido } from '../../interfaces/pedidos.interface';
import { Package, PedidoUPS } from '../../interfaces/pedidoups.interface';
import { Producto } from '../../interfaces/productos.interface';
import { InfoPedidoComponent } from '../../pages/info-pedido/info-pedido.component';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { StripeService } from '../../services/stripe.service';
import { UPSService } from '../../services/ups.service';
import { PagoRealizadoComponent } from '../pago-realizado/pago-realizado.component';


@Component({
  selector: 'app-pago-stripe',
  templateUrl: './pago-stripe.component.html',
  styleUrls: ['./pago-stripe.component.css']
})
export class PagoStripeComponent implements AfterViewInit{

  private baseUrl: string = environment.baseUrl;
    
  cargando_pago: boolean = false;

 
  titular_tarjeta: string ="";

  @Input() pedido!: Pedido;


  @ViewChild('cardInfo') cardInfo!: ElementRef;
  @ViewChild('example2cardnumber') cardNumber!: ElementRef;
  @ViewChild('example2cardexpiry') cardExpiry!: ElementRef;
  @ViewChild('example2cardcvc') cardCVC!: ElementRef;

  //apple pay


  @ViewChild('paymentrequestbutton') ApplepPay!: ElementRef;

  cardError!: string;

  respuesta!: string;

  card: any;
  cardnumber: any;
  cardcvc: any;
  cardexpiry: any;
  applepay: any;

  pedidoUPS!: PedidoUPS;
  paquetes: Package[] =[];


  producto: Producto = {
    id: '',
    nombre: '',
    descripcion: '',
    dias_publicados: '',
    precio: 0,
    peso_total: 0,
    cantidad: '',
    stock: 0,
    foto: '',
    id_categoria: 0,
    id_usuario: 0
  };

  constructor(private stripeService:StripeService,
              private pedidoService: PedidosService,
              private productoService: ProductosService,
              private upsService: UPSService,
              public dialog: MatDialog,
              private authService: AuthService,
              private ngZone: NgZone) { }


  ngAfterViewInit() {
      
    if(!this.pedido){
      window.location.href = "productos/info-pedido";
    }else{


    const inputs = document.querySelectorAll('.cell.example.example2 .input');
  Array.prototype.forEach.call(inputs, function(input) {
    input.addEventListener('focus', function() {
      input.classList.add('focused');
    });
    input.addEventListener('blur', function() {
      input.classList.remove('focused');
    });
    input.addEventListener('keyup', function() {
      if (input.value.length === 0) {
        input.classList.add('empty');
      } else {
        input.classList.remove('empty');
      }
    });
    });

    const elementStyles = {
      base: {
        color: '#32325D',
        fontWeight: 500,
        fontSize: '16px',
        fontSmoothing: 'antialiased',
  
        '::placeholder': {
          color: '#CFD7DF',
        },
        ':-webkit-autofill': {
          color: '#e39f48',
        },
      },
      invalid: {
        color: '#E25950',
  
        '::placeholder': {
          color: '#FFCCA5',
        },
      },
    };
  
    const elementClasses = {
      focus: 'focused',
      empty: 'empty',
      invalid: 'invalid',
    };

    this.cardnumber = elements.create('cardNumber', {
      style: elementStyles,
      classes: elementClasses,
      showIcon: true
    });
    this.cardnumber.mount(this.cardNumber.nativeElement);
  
    this.cardexpiry = elements.create('cardExpiry', {
      style: elementStyles,
      classes: elementClasses,
      showIcon: true
    });
    this.cardexpiry.mount(this.cardExpiry.nativeElement);
  
    this.cardcvc = elements.create('cardCvc', {
      style: elementStyles,
      classes: elementClasses,
      showIcon: true
    });
    this.cardcvc.mount(this.cardCVC.nativeElement);

    // crear tarjeta
    //this.card = elements.create('card');
    //montar en el div #cardInfo
    //this.card.mount(this.cardInfo.nativeElement); 
    //this.card.addEventListener('change', this.onChange.bind(this))


    const paymentRequest = stripe.paymentRequest({
      country: 'ES',
      currency: 'eur',
      total: {
        label: 'KOMOLOCALFOODS',
        amount: this.pedido.total,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    this.applepay = elements.create('paymentRequestButton', {
      paymentRequest: paymentRequest,
    });

    console.log(this.applepay)

    // Check the availability of the Payment Request API first.
    paymentRequest.canMakePayment()
    .then((r: any) => {
        this.applepay.mount(this.ApplepPay.nativeElement);
    })
    .catch((e: any) => console.log(e));

    paymentRequest.on('paymentmethod', async(e: any) =>{

      const {clientSecret} = await fetch (`${ this.baseUrl }/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodType: 'card',
          currency: 'eur',
          amount: this.pedido.total
        })
      }).then(r => r.json());

      

      //confirmar pago del cliente

      const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret,{
        payment_method: e.paymentMethod.id
      }, {handleActions: false});

      if(error){
        //pago fallido
      }

      if (paymentIntent.status === "requires_action") {
        // Let Stripe.js handle the rest of the payment flow.
        const {error} = await stripe.confirmCardPayment(clientSecret);
        if (error) {
          // The payment failed -- ask your customer for a new payment method.
          console.log("pago fallido")
        } else {
          console.log("pago exito")

          // The payment has succeeded.
        }
      } else {
        console.log("pago extito")
        console.log(clientSecret)

        // The payment has succeeded.
      }

      console.log(e);
    })


  }

  }

  

  

  onChange({error}: any) {
    if(error){
      this.ngZone.run(() => this.cardError = error.message);
    }else{
      this.ngZone.run(() => this.cardError = "");

    }
  }

  async onClick() {


    this.cargando_pago = true;

    if(this.titular_tarjeta != ""){

    const {token, error} = await stripe.createToken(this.cardnumber);

    if(token) {

      //await this.stripeService.charge(this.data.total!, token.id, this.data.email)
      console.log(this.pedido)
      this.stripeService.charge(this.pedido.total!, token.id, this.pedido.email!)
        .subscribe(respuesta =>{
          if(respuesta.status = "succeded"){
            this.ngZone.run(() => this.cardError = "");
            this.cargando_pago = false;
            this.guardar();

          }
        }) 
        
    }else{
      this.ngZone.run(() => this.cardError = error.message);
      this.cargando_pago = false;

    }

    }else{
      this.ngZone.run(() => this.cardError = "Rellena el nombre del titular de la tarjeta");
      this.cargando_pago = false;

    }
  }

  DialogDatos(): void {
    const dialogRef = this.dialog.open(PagoRealizadoComponent, {
      width: '300px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      
      let date = new Date(this.pedido.updatedAt!); // some mock date
      let milliseconds = date.getTime(); 

      let id_crypt = this.pedido.id;


      window.location.href = "/productos/fin-pedido/"+milliseconds+"komo"+id_crypt;

    });
  }

  guardar() {
 
    this.pedidoService.getPedidoPorId(this.pedido.id).pipe(
          switchMap(pedido => {
            this.pedido.estado = 'Pagado'
            this.pedido.id_usuario = this.authService.auth.id;

            return this.pedidoService.updatePedido(this.pedido).pipe(
              switchMap(pedido => {
                return this.pedidoService.notificarPedidoAdmin(this.pedido).pipe(
                  switchMap(res=>{
                return this.pedidoService.notificarPedido(this.pedido).pipe(
                  switchMap(respuesta => {
                    return this.pedidoService.getItemPedidos(this.pedido.id)
                  })
                  )
                  })
                )
              })
            )
          })
        ).subscribe(itempedidos => {

          for(let item of itempedidos){


            this.pedidoService.notificarVenta(item)
              .subscribe( item => 
                item)

            this.productoService.getProductoPorId(item.id_producto).pipe (
              switchMap(producto => {
                this.producto = {
                  id: producto.id,
                  nombre: producto.nombre,
                  descripcion: producto.descripcion,
                  dias_publicados: producto.dias_publicados,
                  precio: producto.precio,
                  peso_total: producto.peso_total,
                  cantidad: producto.cantidad,
                  stock: producto.stock, //editar el stock del producto
                  foto: producto.foto,
                  id_categoria: producto.id_categoria,
                  id_usuario: producto.id_usuario
                }

                this.producto.stock = this.producto.stock - item.cantidad;
                console.log(this.producto)

                return this.productoService.actualizarProducto(this.producto)
              })
            ).subscribe(producto => {
          
              this.DialogDatos();

            })

            }
          
    })

    console.log(this.pedidoService.cart)


    /*if(this.checked){

      if(this.infopedido.nombre === null){
        this.infopedido = {
          id: '',
          nombre: this.pedido.nombre,
          apellidos: this.pedido.apellidos,
          calle: this.pedido.calle,
          piso: this.pedido.piso,
          localidad: this.pedido.localidad,
          provincia: this.pedido.provincia,
          codigo_postal: this.pedido.codigo_postal,
          telefono: this.pedido.telefono,
          email: this.pedido.email,
          id_usuario: this.usuario.id,
        }
        this.pedidoService.agregarInfoPedido(this.pedido)
          .subscribe()
      }else{
        this.pedidoService.updateInfoPedido(this.pedido)
          .subscribe()
      }
      
    }*/
  
    //EDITAR STOCKS DE LOS PRODUCTOS




  }
}
