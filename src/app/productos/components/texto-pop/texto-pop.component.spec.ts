import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextoPopComponent } from './texto-pop.component';

describe('TextoPopComponent', () => {
  let component: TextoPopComponent;
  let fixture: ComponentFixture<TextoPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextoPopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextoPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
