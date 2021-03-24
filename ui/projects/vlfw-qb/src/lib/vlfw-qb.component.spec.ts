import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VlfwQbComponent } from './vlfw-qb.component';

describe('VlfwQbComponent', () => {
  let component: VlfwQbComponent;
  let fixture: ComponentFixture<VlfwQbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VlfwQbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VlfwQbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
