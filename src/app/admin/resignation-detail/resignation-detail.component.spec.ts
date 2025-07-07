import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationDetailComponent } from './resignation-detail.component';

describe('ResignationDetailComponent', () => {
  let component: ResignationDetailComponent;
  let fixture: ComponentFixture<ResignationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResignationDetailComponent]
    });
    fixture = TestBed.createComponent(ResignationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
