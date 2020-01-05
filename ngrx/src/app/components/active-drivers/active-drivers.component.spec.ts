import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveDriversComponent } from './active-drivers.component';

describe('ActiveDriversComponent', () => {
  let component: ActiveDriversComponent;
  let fixture: ComponentFixture<ActiveDriversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveDriversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
