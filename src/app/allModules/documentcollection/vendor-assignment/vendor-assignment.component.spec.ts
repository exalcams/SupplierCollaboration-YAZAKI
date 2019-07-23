import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAssignmentComponent } from './vendor-assignment.component';

describe('VendorAssignmentComponent', () => {
  let component: VendorAssignmentComponent;
  let fixture: ComponentFixture<VendorAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
