import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { Usuario } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-item-productor',
  templateUrl: './item-productor.component.html',
  styleUrls: ['./item-productor.component.css']
})
export class ItemProductorComponent implements OnInit {

  @Input() infoUser!: Usuario;

  icono_fav:string ="favorite"


  constructor(private sharedService: SharedService,
              private router: Router) { }

  ngOnInit(): void {
    
  }

  ir_productor(){
    this.sharedService.SetproductoId = Number(this.infoUser.id_usuario);
    this.router.navigate(['/productos/productor']);
    
  }


}
