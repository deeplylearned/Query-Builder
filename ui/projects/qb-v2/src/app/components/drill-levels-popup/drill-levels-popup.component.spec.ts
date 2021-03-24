import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrillLevelsPopupComponent } from './drill-levels-popup.component';

describe('DrillLevelsPopupComponent', () => {
  let component: DrillLevelsPopupComponent;
  let fixture: ComponentFixture<DrillLevelsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrillLevelsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrillLevelsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
