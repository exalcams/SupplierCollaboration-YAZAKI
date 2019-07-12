import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReportReferenceComponent } from './payment-report-reference.component';

describe('PaymentReportReferenceComponent', () => {
  let component: PaymentReportReferenceComponent;
  let fixture: ComponentFixture<PaymentReportReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentReportReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReportReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
