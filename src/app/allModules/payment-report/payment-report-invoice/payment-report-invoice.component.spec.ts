import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReportInvoiceComponent } from './payment-report-invoice.component';

describe('PaymentReportInvoiceComponent', () => {
  let component: PaymentReportInvoiceComponent;
  let fixture: ComponentFixture<PaymentReportInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentReportInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReportInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
