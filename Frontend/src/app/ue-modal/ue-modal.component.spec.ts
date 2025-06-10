import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UeModalComponent } from './ue-modal.component';

describe('UeModalComponent', () => {
  let component: UeModalComponent;
  let fixture: ComponentFixture<UeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UeModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
