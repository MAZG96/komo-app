import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements  AfterViewInit  {

  miFormulario: FormGroup = this.fb.group({
    correo: ['',[ Validators.email]],
  });

  logueado: boolean = false;
  error: boolean = false;
  texto_error: string ="";

  

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService : AuthService) { }
  
  ngAfterViewInit(): void {

    
  }

  

  recuperacion(){

    const { correo } = this.miFormulario.value;

    this.authService.recuperar( correo )
    .subscribe( ok =>{
      if(ok === true){
        this.texto_error ="Hemos enviado un mensaje a tu correo para cambiar la contraseña";
        this.logueado = true;  
        this.error = true;
      }else{
        if(correo == ""){
          this.texto_error ="Rellene el correo"
          this.error = true;
        }else{
          this.texto_error ="Correo no asociado a ninguna cuenta"
          this.error = true;
        }
        this.error = true;
      }
      
    });

  }

}
