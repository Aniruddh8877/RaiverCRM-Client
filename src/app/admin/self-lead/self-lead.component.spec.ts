import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfLeadComponent } from './self-lead.component';

describe('SelfLeadComponent', () => {
  let component: SelfLeadComponent;
  let fixture: ComponentFixture<SelfLeadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelfLeadComponent]
    });
    fixture = TestBed.createComponent(SelfLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
