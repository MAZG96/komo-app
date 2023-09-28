import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Auth } from '../../../productos/interfaces/auth.interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loginadmin',
  templateUrl: './loginadmin.component.html',
  styleUrls: ['loginadmin.component.css']
})
export class LoginadminComponent {
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


  

  login(){

    const { username, password } = this.miFormulario.value;


    this.authService.login_admin( username, password )
    .subscribe( ok =>{
      this.logueado = false;
      if(ok === true){
        this.router.navigateByUrl('/backoffice')
      }else{
        if(username == "" || password == ""){
          this.texto_error ="Rellene los campos"
        }else{
          this.texto_error ="Usuario o contraseña incorrecta"
        }
        this.error = true;
        this.logueado = true;
        console.log(this.logueado);
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
