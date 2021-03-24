import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttrListComponent } from './attr-list.component';

describe('AttrListComponent', () => {
  let component: AttrListComponent;
  let fixture: ComponentFixture<AttrListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttrListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
