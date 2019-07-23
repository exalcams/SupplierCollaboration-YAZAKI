import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapaAssignmentComponent } from './capa-assignment.component';

describe('CapaAssignmentComponent', () => {
  let component: CapaAssignmentComponent;
  let fixture: ComponentFixture<CapaAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapaAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapaAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
