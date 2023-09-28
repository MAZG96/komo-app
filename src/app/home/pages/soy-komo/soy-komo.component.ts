import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';


@Component({
  selector: 'app-soy-komo',
  templateUrl: './soy-komo.component.html',
  styleUrls: ['./soy-komo.component.css']
})
export class SoyKomoComponent implements OnInit {

  constructor(public location: Location) { }

  ngOnInit(): void {
  }

  volver(){
    
    this.location.back();  
  }
  
}
