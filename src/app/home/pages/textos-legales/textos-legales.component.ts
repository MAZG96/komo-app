import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-textos-legales',
  templateUrl: './textos-legales.component.html',
  styleUrls: ['./textos-legales.component.css']
})
export class TextosLegalesComponent implements OnInit {

  constructor(public location: Location,
    public router :Router) { }

  ngOnInit(): void {
  }

  volver(){
    
    this.location.back();  
  }
  
}
