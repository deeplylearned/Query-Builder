import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseTypesPopupComponent } from './response-types-popup.component';

describe('ResponseTypesPopupComponent', () => {
  let component: ResponseTypesPopupComponent;
  let fixture: ComponentFixture<ResponseTypesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseTypesPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseTypesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
