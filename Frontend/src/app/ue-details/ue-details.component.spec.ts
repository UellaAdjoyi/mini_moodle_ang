import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UeDetailsComponent } from './ue-details.component';

describe('UeDetailsComponent', () => {
  let component: UeDetailsComponent;
  let fixture: ComponentFixture<UeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UeDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
