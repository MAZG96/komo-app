import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextocomprobardatosComponent } from './textocomprobardatos.component';

describe('TextocomprobardatosComponent', () => {
  let component: TextocomprobardatosComponent;
  let fixture: ComponentFixture<TextocomprobardatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextocomprobardatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextocomprobardatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
