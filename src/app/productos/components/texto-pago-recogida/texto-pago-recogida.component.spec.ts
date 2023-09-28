import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextoPagoRecogidaComponent } from './texto-pago-recogida.component';

describe('TextoPagoRecogidaComponent', () => {
  let component: TextoPagoRecogidaComponent;
  let fixture: ComponentFixture<TextoPagoRecogidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextoPagoRecogidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextoPagoRecogidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
