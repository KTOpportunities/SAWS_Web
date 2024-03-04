import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBroadcastComponent } from './add-broadcast.component';

describe('AddBroadcastComponent', () => {
  let component: AddBroadcastComponent;
  let fixture: ComponentFixture<AddBroadcastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBroadcastComponent]
    });
    fixture = TestBed.createComponent(AddBroadcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
