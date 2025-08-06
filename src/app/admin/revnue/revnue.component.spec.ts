import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevnueComponent } from './revnue.component';

describe('RevnueComponent', () => {
  let component: RevnueComponent;
  let fixture: ComponentFixture<RevnueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevnueComponent]
    });
    fixture = TestBed.createComponent(RevnueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
