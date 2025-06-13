import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAssignComponent } from './lead-assign.component';

describe('LeadAssignComponent', () => {
  let component: LeadAssignComponent;
  let fixture: ComponentFixture<LeadAssignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeadAssignComponent]
    });
    fixture = TestBed.createComponent(LeadAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
