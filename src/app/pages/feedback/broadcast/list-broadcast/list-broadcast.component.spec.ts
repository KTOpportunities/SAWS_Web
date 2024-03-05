import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBroadcastComponent } from './list-broadcast.component';

describe('ViewBroadcastComponent', () => {
  let component: ListBroadcastComponent;
  let fixture: ComponentFixture<ListBroadcastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBroadcastComponent]
    });
    fixture = TestBed.createComponent(ListBroadcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
