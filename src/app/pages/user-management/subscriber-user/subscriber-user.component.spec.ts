import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberUserComponent } from './subscriber-user.component';

describe('SubscriberUserComponent', () => {
  let component: SubscriberUserComponent;
  let fixture: ComponentFixture<SubscriberUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriberUserComponent]
    });
    fixture = TestBed.createComponent(SubscriberUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
