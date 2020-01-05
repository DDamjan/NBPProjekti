import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindNearestComponent } from './find-nearest.component';

describe('FindNearestComponent', () => {
  let component: FindNearestComponent;
  let fixture: ComponentFixture<FindNearestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindNearestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindNearestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
