import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalalyManagementComponent } from './salaly-management.component';

describe('SalalyManagementComponent', () => {
  let component: SalalyManagementComponent;
  let fixture: ComponentFixture<SalalyManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalalyManagementComponent]
    });
    fixture = TestBed.createComponent(SalalyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
