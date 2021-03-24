import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggAttrListComponent } from './agg-attr-list.component';

describe('AggAttrListComponent', () => {
  let component: AggAttrListComponent;
  let fixture: ComponentFixture<AggAttrListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggAttrListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggAttrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
