import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderacknowledgmentComponent } from './orderacknowledgment.component';

describe('OrderacknowledgmentComponent', () => {
  let component: OrderacknowledgmentComponent;
  let fixture: ComponentFixture<OrderacknowledgmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderacknowledgmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderacknowledgmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
