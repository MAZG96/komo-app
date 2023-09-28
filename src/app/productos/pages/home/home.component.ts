import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterOutlet } from '@angular/router';
import {Location} from '@angular/common';
import { MapViewComponent } from 'src/app/maps/components/map-view/map-view.component';
import { SearchResultsComponent } from 'src/app/maps/components/search-results/search-results.component';
import { Feature } from 'src/app/maps/interfaces/place';
import { MapSearchComponent } from 'src/app/maps/screens/map-search/map-search.component';
import { AuthService } from '../../../auth/services/auth.service';
import { Auth } from '../../interfaces/auth.interfaces';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { AgregarComponent } from '../agregar/agregar.component';
import { tap } from 'rxjs/operators';
import { slideInAnimation } from 'animation';
import { fader } from 'src/app/animations';
import { SharedService } from 'src/app/services/shared.service';
import { NgxXmlToJsonService } from 'ngx-xml-to-json';
import { UPSService } from '../../services/ups.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [`

    .icono-bold{
      font-weight: bold;
    }

    .mat-sidenav-container{
      background-color: white !important;
      display:none;
    }

    
      
     @media screen and (max-width: 600px) {
    
     
  }
  
  
    
    .container {
      margin: 5px;
    }

    @media screen and (min-width: 600px) {
      .menu{
        display: none !important;
      }
      #sidenav {
        display: none !important;
      }

      #toolbarnav {
        display: none !important;
      } 
    
    }


      .toolbarNav {
        position: fixed;
        bottom: 0;
        z-index: 1000;
        display: flex;
        justify-content: center;
        background-color: white;
      }
    .toolbarNav button {
      padding:0px 37px 0px 37px;
      flex-direction: column;
      align-items: center;
    }

    .headerNav {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
      display: flex;
      justify-content: center;
      background-color: white;
      border-bottom: 0px solid;
      padding-left: 10px;
      padding-right: 10px;

    }

    button:hover, .active-link {
      color: black;
    }



  `],
  animations: [
    fader
  ]
})
export class HomeComponent implements OnInit {

  lugar_elegido!: Feature;
  
  xml= `<?xml version="1.0" encoding="UTF-8"?>
  <LocatorResponse>
      <Response>
          <TransactionReference>
              <CustomerContext>XOLT Sample Code</CustomerContext>
          </TransactionReference>
          <ResponseStatusCode>1</ResponseStatusCode>
          <ResponseStatusDescription>Success</ResponseStatusDescription>
      </Response>
      <SearchResults>
          <DropLocation>
              <LocationID>189780</LocationID>
              <IVR>
                  <PhraseID>0</PhraseID>
              </IVR>
              <Geocode>
                  <Latitude>36.28416061</Latitude>
                  <Longitude>-6.08420991</Longitude>
              </Geocode>
              <AddressKeyFormat>
                  <ConsigneeName>GASOLINERA PETROLIA</ConsigneeName>
                  <AddressLine>AVENIDA DE LA MUSICA 8</AddressLine>
                  <PoliticalDivision2>CONIL DE LA FRONTERA</PoliticalDivision2>
                  <PostcodePrimaryLow>11140</PostcodePrimaryLow>
                  <CountryCode>ES</CountryCode>
              </AddressKeyFormat>
              <LocationAttribute>
                  <OptionType>
                      <Code>01</Code>
                      <Description>Location</Description>
                  </OptionType>
                  <OptionCode>
                      <Code>018</Code>
                      <Description>UPS Access Point&amp;trade;</Description>
                  </OptionCode>
              </LocationAttribute>
              <Distance>
                  <Value>0.9</Value>
                  <UnitOfMeasurement>
                      <Code>KM</Code>
                      <Description>KILOMETERS</Description>
                  </UnitOfMeasurement>
              </Distance>
              <SpecialInstructions>
                  <Segment>Pasando el Burguerking</Segment>
              </SpecialInstructions>
              <AdditionalChargeIndicator/>
              <StandardHoursOfOperation>Mon-Fri: 7:00am-10:00pm; Sat, Sun: 8:00am-10:00pm</StandardHoursOfOperation>
              <OperatingHours>
                  <StandardHours>
                      <HoursType>10</HoursType>
                      <DayOfWeek>
                          <Day>1</Day>
                          <OpenHours>800</OpenHours>
                          <CloseHours>2200</CloseHours>
                      </DayOfWeek>
                      <DayOfWeek>
                          <Day>2</Day>
                          <OpenHours>700</OpenHours>
                          <CloseHours>2200</CloseHours>
                      </DayOfWeek>
                      <DayOfWeek>
                          <Day>3</Day>
                          <OpenHours>700</OpenHours>
                          <CloseHours>2200</CloseHours>
                      </DayOfWeek>
                      <DayOfWeek>
                          <Day>4</Day>
                          <OpenHours>700</OpenHours>
                          <CloseHours>2200</CloseHours>
                      </DayOfWeek>
                      <DayOfWeek>
                          <Day>5</Day>
                          <OpenHours>700</OpenHours>
                          <CloseHours>2200</CloseHours>
                      </DayOfWeek>
                      <DayOfWeek>
                          <Day>6</Day>
                          <OpenHours>700</OpenHours>
                          <CloseHours>2200</CloseHours>
                      </DayOfWeek>
                      <DayOfWeek>
                          <Day>7</Day>
                          <OpenHours>800</OpenHours>
                          <CloseHours>2200</CloseHours>
                      </DayOfWeek>
                  </StandardHours>
              </OperatingHours>
              <Comments>Pasando el Burguerking</Comments>
              <SLIC>2361</SLIC>
              <ServiceOfferingList>
                  <ServiceOffering>
                      <Code>001</Code>
                      <Description>Directo a punto de entrega</Description>
                  </ServiceOffering>
                  <ServiceOffering>
                      <Code>002</Code>
                      <Description>No en un UEA</Description>
                  </ServiceOffering>
                  <ServiceOffering>
                      <Code>004</Code>
                      <Description>Retail to retail</Description>
                  </ServiceOffering>
                  <ServiceOffering>
                      <Code>007</Code>
                      <Description>PUDO</Description>
                  </ServiceOffering>
                  <ServiceOffering>
                      <Code>010</Code>
                      <Description>Interceptación de CER OCE aceptada</Description>
                  </ServiceOffering>
                  <ServiceOffering>
                      <Code>011</Code>
                      <Description>Acepta pagos</Description>
                  </ServiceOffering>
                  <ServiceOffering>
                      <Code>012</Code>
                      <Description>Pagar en tienda</Description>
                  </ServiceOffering>
                  <ServiceOffering>
                      <Code>015</Code>
                      <Description>Acepta códigos de barra móviles</Description>
                  </ServiceOffering>
              </ServiceOfferingList>
              <DisplayPhoneNumberIndicator>0</DisplayPhoneNumberIndicator>
              <AccessPointInformation>
                  <PublicAccessPointID>U06163919</PublicAccessPointID>
                  <ImageURL>https://rms.ups.com/rms/image?id=64267AA7-04BC-4C47-A644-DE51FFE217F7</ImageURL>
                  <BusinessClassificationList>
                      <BusinessClassification>
                          <Code>021</Code>
                          <Description>OTHER</Description>
                      </BusinessClassification>
                  </BusinessClassificationList>
                  <AccessPointStatus>
                      <Code>01</Code>
                      <Description>ACTIVE</Description>
                  </AccessPointStatus>
              </AccessPointInformation>
              <LocationNewIndicator>N</LocationNewIndicator>
              <WillCallLocationIndicator>N</WillCallLocationIndicator>
          </DropLocation>
          <DropLocation>
              <LocationID>185002</LocationID>
              <IVR>
                  <PhraseID>0</PhraseID>
              </IVR>
              <Geocode>
                  <Latitude>36.24745941</Latitude>
                  <Longitude>-5.96724987</Longitude>
              </Geocode>
              <AddressKeyFormat>
                  <ConsigneeName>INFOMEGO</ConsigneeName>
                  <AddressLine>CALLE PINTOR FRANCISCO PRIETO, 4A</AddressLine>
                  <PoliticalDivision2>VEJER DE LA FRONTERA</PoliticalDivision2>
                  <PostcodePrimaryLow>11150</PostcodePrimaryLow>
                  <CountryCode>ES</CountryCode>
              </AddressKeyFormat>
              <LocationAttribute>
                  <OptionType>
                      <Code>01</Code>
                      <Description>Location</Description>
                  </OptionType>
                  <OptionCode>
                      <Code>018</Code>
                      <Description>UPS Access Point&amp;trade;</Description>
                  </OptionCode>
              </LocationAttribute>
              <Distance>
                  <Value>11.4</Value>
                  <UnitOfMeasurement>
                      <Code>KM</Code>
                      <Description>KILOMETERS</Description>
                  </UnitOfMeasurement>
              </Distance>
              <SpecialInstructions>
                  <Segment>Cerca de recinto ferial</Segment>
              </SpecialInstructions>
              <AdditionalChargeIndicator/>
              <StandardHoursOfOperation>Mon-Fri: 9:00am-2:00pm, 5:00pm-8:00pm; Sat, Sun: Closed</StandardHoursOfOperation>
              <OperatingHours>
                  <StandardHours>
                      <HoursType>10</HoursType>
                      <DayOfWeek>
                          <Day>1</Day>
                          <ClosedIndicator/>
                      </DayOfWeek>
                      <DayOfWeek>
                          <Day>2</Day>
                          <OpenHours>900</OpenHours>
                          <CloseHours>1400</CloseHours>
                          <OpenHours>1700</OpenHours>
                          <CloseHours>2000</CloseHours>
                      </DayOfWeek>
                      <DayOfWeek>
                          <Day>3</Day>
                          <OpenHours>900</OpenHours>
                          <CloseHours>1400</CloseHours>
                          <OpenHours>1700</OpenHours>
                          <CloseHours>2000</CloseHours>
                      </DayOfWeek>
                      <DayOfWeek>
                          <Day>4</Day>
                          <OpenHours>900</OpenHours>
                          <CloseHours>1400</CloseHours>
                          <OpenHours>1700</OpenHours>
                          <CloseHours>2000</CloseHours>
                      </DayOfWeek>
                      <DayOfWeek>
                          <Day>5</Day>
                          <OpenHours>900</OpenHours>
                          <CloseHours>1400</CloseHours>
                          <OpenHours>1700</OpenHours>
                          <CloseHours>2000</CloseHours>
                      </DayOfWeek>
                      <DayOfWeek>
                          <Day>6</Day>
                          <OpenHours>900</OpenHours>
                          <CloseHours>1400</CloseHours>
                          <OpenHours>1700</OpenHours>
                          <CloseHours>2000</CloseHours>
                      </DayOfWeek>
                      <DayOfWeek>
                          <Day>7</Day>
                          <ClosedIndicator/>
                      </DayOfWeek>
                  </StandardHours>
              </OperatingHours>
              <Comments>Cerca de recinto ferial</Comments>
              <SLIC>2361</SLIC>
              <PromotionInformation>
                  <Locale>en_ES</Locale>
                  <Promotion>Cerca de recinto ferial</Promotion>
              </PromotionInformation>
              <PromotionInformation>
                  <Locale>es_ES</Locale>
                  <Promotion>Cerca de recinto ferial</Promotion>
              </PromotionInformation>
              <ServiceOfferingList>
                  <ServiceOffering>
                      <Code>001</Code>
                      <Description>Directo a punto de entrega</Description>
                  </ServiceOffering>
                  <ServiceOffering>
                      <Code>002</Code>
                      <Description>No en un UEA</Description>
                  </ServiceOffering>
                  <ServiceOffering>
                      <Code>004</Code>
                      <Description>Retail to retail</Description>
                  </ServiceOffering>
                  <ServiceOffering>
                      <Code>007</Code>
                      <Description>PUDO</Description>
                  </ServiceOffering>
                  <ServiceOffering>
                      <Code>010</Code>
                      <Description>Interceptación de CER OCE aceptada</Description>
                  </ServiceOffering>
                  <ServiceOffering>
                      <Code>011</Code>
                      <Description>Acepta pagos</Description>
                  </ServiceOffering>
                  <ServiceOffering>
                      <Code>012</Code>
                      <Description>Pagar en tienda</Description>
                  </ServiceOffering>
                  <ServiceOffering>
                      <Code>015</Code>
                      <Description>Acepta códigos de barra móviles</Description>
                  </ServiceOffering>
              </ServiceOfferingList>
              <DisplayPhoneNumberIndicator>0</DisplayPhoneNumberIndicator>
              <AccessPointInformation>
                  <PublicAccessPointID>U79420110</PublicAccessPointID>
                  <ImageURL>https://rms.ups.com/rms/image?id=9A046EE5-8E4E-4DEA-A677-D36343E8654E</ImageURL>
                  <BusinessClassificationList>
                      <BusinessClassification>
                          <Code>021</Code>
                          <Description>OTHER</Description>
                      </BusinessClassification>
                  </BusinessClassificationList>
                  <AccessPointStatus>
                      <Code>01</Code>
                      <Description>ACTIVE</Description>
                  </AccessPointStatus>
              </AccessPointInformation>
              <LocationNewIndicator>N</LocationNewIndicator>
              <WillCallLocationIndicator>N</WillCallLocationIndicator>
          </DropLocation>
      </SearchResults>
  </LocatorResponse>`;


  prepareRoute(outlet :RouterOutlet){
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  

  get usuario() { //permancer logueado
    return this.authService.auth;
  }

  get carrito() { //permancer logueado
    return this.pedidoService.cart;
  }

  
  get n_productos_carrito() :number{ //permancer logueado
    return this.pedidoService.carrito_numero_productos();
  }

  


  

  constructor(public router :Router,
    private authService: AuthService,
    private pedidoService: PedidosService,
    public dialog: MatDialog,
    private productoService: ProductosService,
    private upsService: UPSService,
    private sharedService: SharedService,
    private ngxXmlToJsonService: NgxXmlToJsonService,
    public location: Location) { 
    }

    

  volver(){
    
    this.location.back();  
  }
  

  
  ngOnInit(): void {

    
    

    if(localStorage.getItem("token-google")){
      let token = localStorage.getItem("token-google");
      
      this.authService.login_google(token!)
        .subscribe(ok => {
          this.authService.validarToken()
          .subscribe(user => {
            console.log(user);
          })
      })
    }else{
      this.authService.validarToken()
      .subscribe(user => {
      })
    }

    if(!localStorage.getItem("LOC") && this.router.url !== '/productos/agregar' && this.router.url !== '/productos/editar'){
        this.router.navigate(['/'])
    }
    
    //this.router.navigate(['/productos/listado'])

  }

  borrar_ref(){
    if(this.router.url !== '/productos/pedidos' && this.router.url !== '/productos/editar'){
      this.sharedService.SetproductoId_back = -1;
    }
  }


  login_google(){
    this.authService.login_google(localStorage.getItem("token")!).subscribe()
  }

  logout() :void {
    
    this.pedidoService.cart = [];
    localStorage.clear();
    this.router.navigate(['./auth']);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MapSearchComponent, {
      width: '250px',
      data: {lugar_elegido: this.lugar_elegido},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.lugar_elegido = result;

      this.lugar_elegido = JSON.parse(localStorage.getItem("LOC")!);
      localStorage.removeItem("LOC")
    });
  }
  
}


