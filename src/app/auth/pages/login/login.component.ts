import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import jwt_decode from 'jwt-decode';
declare var google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
    mat-grid-list{
      margin-top: -50px;
      margin-bottom: -120px;
    }

    mat-spinner{
      color: black;
    }

    :host {
      display: flex;
      justify-content: center;
      margin: 100px 0px;
    }

    .mat-form-field {
      width: 100%;
      min-width: 300px;
    }

    mat-card-title,
    mat-card-content {
      display: flex;
      justify-content: center;
    }

    .error {
      padding: 10px;
      width: 300px;
      color: black;
      border: 1px solid black;
      display: flex;
      justify-content: center;
      
    }

    .button {
      display: flex;
      justify-content: center;
    }

    .button-google{
      display: flex;
      justify-content: center;
      margin-top: 20px;
      margin-bottom: -20px;
      margin-right: -15px;
    }

    .registro{
      display: flex;
      justify-content: center;
      margin-top: 40px;
    }

    .mat-form-field-placeholder {
      display:block !important;
      }

    img{
      padding: 20px;
      width: 100%;
      display: flex;
      justify-content: center;
      position:center;
      
    }
    
  `
   
  ]
})
export class LoginComponent implements  AfterViewInit{

  miFormulario: FormGroup = this.fb.group({
    username: ['',[ Validators.email]],
    password: ['', [ Validators.minLength(6)]],
  });

  logueado: boolean = true;
  error: boolean = false;
  texto_error: string ="";

  

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService : AuthService) { }
  
  ngAfterViewInit(): void {
     
      google.accounts.id.initialize({
        client_id: "103028434187-41n7grnuhdlvssjvqc65cfs9uc399kb2.apps.googleusercontent.com",
        callback: this.handleCredentialResponse
      });
      google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" }  // customization attributes
      );
      google.accounts.id.prompt(); // also display the One Tap dialog
    
      console.log("hola")
  }

  handleCredentialResponse(response :any){
    console.log(jwt_decode(response.credential));
    if(response.credential){
      localStorage.setItem("token-google",response.credential);
      document.location.href="./productos/listado"   
    }
      
  }
  

  login(){

    console.log("ok");

    const { username, password } = this.miFormulario.value;

    
    this.authService.login( username, password )
    .subscribe( ok =>{

      this.logueado = false;
      if(ok === true){
        this.router.navigate(['./elige-perfil']);
        
      }else{
        if(username == "" || password == ""){
          this.texto_error ="Rellene los campos"
        }else{
          this.texto_error ="Usuario o contraseña incorrecta"
        }
        this.error = true;
        this.logueado = true;
      }
      
    });

    //ir al backend
    //comprobar un usuario
    
    /*this.authService.login()
    .subscribe( resp => 
     {
      console.log(resp);
        if(resp.id){
          this.router.navigate(['/heroes/']);
        }
    });*/
    //this.router.navigate(['./productos']);

  }



  logout(){
    //this.router.navigate(['./productos']);

  }

}
