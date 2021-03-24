import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggFilterPreviewComponent } from './agg-filter-preview.component';

describe('AggFilterPreviewComponent', () => {
  let component: AggFilterPreviewComponent;
  let fixture: ComponentFixture<AggFilterPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggFilterPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggFilterPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
