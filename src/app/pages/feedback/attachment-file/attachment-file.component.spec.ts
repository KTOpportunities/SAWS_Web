import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentFileComponent } from './attachment-file.component';

describe('AttachmentFileComponent', () => {
  let component: AttachmentFileComponent;
  let fixture: ComponentFixture<AttachmentFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttachmentFileComponent]
    });
    fixture = TestBed.createComponent(AttachmentFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
