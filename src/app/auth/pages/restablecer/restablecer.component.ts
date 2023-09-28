import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { InfoUsuarioService } from 'src/app/productos/services/info-usuario.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.component.html',
  styleUrls: ['./restablecer.component.css']
})
export class RestablecerComponent{

  miFormulario: FormGroup = this.fb.group({
    password: [''],
    password_c: [''],
  });

  logueado: boolean = false;
  error: boolean = false;
  texto_error: string ="";

  

  constructor(private fb: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private infoUser: InfoUsuarioService,
              private authService : AuthService) { }

  restablecer(){
    const { password, password_c } = this.miFormulario.value;

    

    if(password.length < 8){
      this.texto_error ="Contraseña debe ser mínimo de 8 caracteres";
      this.error = true;
      return;
    }

    if(password != password_c){
      this.texto_error ="No coinciden las contraseñas";
      this.error = true;

      return;
    }

    this.activatedRoute.params.pipe(
      switchMap( ({ token_recuperacion }) => 
    this.authService.restablecer( password, token_recuperacion )))
    .subscribe( ok =>{

      
      if(ok === true){
        this.texto_error ="Contraseña restablecida";
        this.error = true;
        this.logueado = true;  

      }else{
        if(password == ""){
          this.texto_error ="Rellene los campos"
          this.error = true;
        }
        this.texto_error ="Enlace caducado"
        this.error = true;
        this.logueado = true;
        
      }
      
    });

  }
}
