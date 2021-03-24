import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveQueryPopupComponent } from './save-query-popup.component';

describe('SaveQueryPopupComponent', () => {
  let component: SaveQueryPopupComponent;
  let fixture: ComponentFixture<SaveQueryPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveQueryPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveQueryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
