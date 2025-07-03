import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveDetailComponent } from './leave-detail.component';

describe('LeaveDetailComponent', () => {
  let component: LeaveDetailComponent;
  let fixture: ComponentFixture<LeaveDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveDetailComponent]
    });
    fixture = TestBed.createComponent(LeaveDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
