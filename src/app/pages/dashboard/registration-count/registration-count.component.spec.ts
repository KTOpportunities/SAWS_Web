import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationCountComponent } from './registration-count.component';

describe('RegistrationCountComponent', () => {
  let component: RegistrationCountComponent;
  let fixture: ComponentFixture<RegistrationCountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationCountComponent]
    });
    fixture = TestBed.createComponent(RegistrationCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
