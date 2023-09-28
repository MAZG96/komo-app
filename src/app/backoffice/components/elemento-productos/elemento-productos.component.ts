import { Component, Input, OnInit } from '@angular/core';
import { Producto } from 'src/app/productos/interfaces/productos.interface';

@Component({
  selector: 'app-elemento-productos',
  templateUrl: './elemento-productos.component.html',
  styleUrls: ['./elemento-productos.component.css']
})
export class ElementoProductosComponent implements OnInit {

  @Input() item!: Producto;

  constructor() { }

  ngOnInit(): void {
  }

}
