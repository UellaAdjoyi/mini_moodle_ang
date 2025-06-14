import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignUeModalComponent } from './assign-ue-modal.component';

describe('AssignUeModalComponent', () => {
  let component: AssignUeModalComponent;
  let fixture: ComponentFixture<AssignUeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignUeModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignUeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
