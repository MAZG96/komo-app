import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-texto-pop',
  templateUrl: './texto-pop.component.html',
  styleUrls: ['./texto-pop.component.css']
})
export class TextoPopComponent implements OnInit {

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: string) { }

  datos: string[] = []

  ngOnInit(): void {

    this.datos = this.data.split('.');
  }

}
