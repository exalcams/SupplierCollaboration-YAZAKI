import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTicketConfirmationDialogComponent } from './support-ticket-confirmation-dialog.component';

describe('SupportTicketConfirmationDialogComponent', () => {
  let component: SupportTicketConfirmationDialogComponent;
  let fixture: ComponentFixture<SupportTicketConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportTicketConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportTicketConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
