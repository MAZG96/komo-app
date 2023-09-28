import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextoUbicacionComponent } from './texto-ubicacion.component';

describe('TextoUbicacionComponent', () => {
  let component: TextoUbicacionComponent;
  let fixture: ComponentFixture<TextoUbicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextoUbicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextoUbicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
