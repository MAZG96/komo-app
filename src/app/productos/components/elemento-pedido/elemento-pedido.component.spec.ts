import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementoPedidoComponent } from './elemento-pedido.component';

describe('ElementoPedidoComponent', () => {
  let component: ElementoPedidoComponent;
  let fixture: ComponentFixture<ElementoPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementoPedidoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementoPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
