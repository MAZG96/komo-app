import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextoFrioComponent } from './texto-frio.component';

describe('TextoFrioComponent', () => {
  let component: TextoFrioComponent;
  let fixture: ComponentFixture<TextoFrioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextoFrioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextoFrioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
