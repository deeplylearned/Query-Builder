import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TostrsComponent } from './tostrs.component';

describe('TostrsComponent', () => {
  let component: TostrsComponent;
  let fixture: ComponentFixture<TostrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TostrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TostrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
