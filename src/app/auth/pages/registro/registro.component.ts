import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
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
export class RegistroComponent {

  miFormulario: FormGroup = this.fb.group({
    name: ['', [] ],
    email: ['',[]],
    password: ['', []],
    confirmacion: ['', []],
  });


  logueado: boolean = false;
  error: boolean = false;
  texto_error: string ="";
  

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService) { }

  registro(){

    const { name, email, password, confirmacion } = this.miFormulario.value;

    if(name == "" || password == "" || email == "" || confirmacion == ""){
      this.texto_error ="Rellene los campos"
      this.error = true;
    }else{

      if(password.length < 6){
        this.texto_error ="Contraseña menor de 6 caracteres";
        this.error = true;

      }
      if(confirmacion != password){
        this.texto_error ="Contraseñas no coinciden";
        this.error = true;           
      }
      
      else{
        this.authService.registro( name, email, password )
        .subscribe( ok =>{

          if(ok === true){
            this.texto_error ="Hemos enviado un mail a tu cuenta de correo para activar tu cuenta creada en KOMOLOCALFOODS"
            this.logueado = true;
            this.error = true;

            
          }else{
            
            if(confirmacion != password){
              this.texto_error ="Contraseñas no coinciden";
              this.error = true;           
            }
            else{
              
              if(ok === undefined){
                this.texto_error = "Comprueba el correo"
                this.error = true;
              }else{
                this.texto_error = ok
              }
            }
            this.error = true;
          }

        });
      }
    }
  }
}