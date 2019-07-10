import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentnotificationComponent } from './shipmentnotification.component';

describe('ShipmentnotificationComponent', () => {
  let component: ShipmentnotificationComponent;
  let fixture: ComponentFixture<ShipmentnotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentnotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
