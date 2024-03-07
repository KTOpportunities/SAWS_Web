import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdvertImageComponent } from './view-advert-image.component';

describe('ViewAdvertImageComponent', () => {
  let component: ViewAdvertImageComponent;
  let fixture: ComponentFixture<ViewAdvertImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAdvertImageComponent]
    });
    fixture = TestBed.createComponent(ViewAdvertImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
