import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalRowComponent } from './total-row.component';

describe('TotalRowComponent', () => {
  let component: TotalRowComponent;
  let fixture: ComponentFixture<TotalRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
