import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAccesspointComponent } from './item-accesspoint.component';

describe('ItemAccesspointComponent', () => {
  let component: ItemAccesspointComponent;
  let fixture: ComponentFixture<ItemAccesspointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemAccesspointComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemAccesspointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
