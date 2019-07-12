import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReportPoComponent } from './payment-report-po.component';

describe('PaymentReportPoComponent', () => {
  let component: PaymentReportPoComponent;
  let fixture: ComponentFixture<PaymentReportPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentReportPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReportPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
