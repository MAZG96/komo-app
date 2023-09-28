import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginComponent } from '../pages/login/login.component';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard /*implements CanActivate, CanLoad*/ {
  constructor(private authService: AuthService,
              public dialog: MatDialog,
              private router: Router){}
  
              
  canActivate(): Observable<boolean> | boolean {
    
    return this.authService.validarToken()
      .pipe(
        tap( valid => {
          if(!valid){

            this.router.navigateByUrl('/auth');
          }
        })
      )
  }

  //Protege las rutas para acceder con login unicamente
  
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | boolean {
      
    return this.authService.validarToken()
    .pipe(
      tap( valid => {
        if(!valid){

          this.router.navigateByUrl('/auth');
        }
      })
    )
  
}


}


