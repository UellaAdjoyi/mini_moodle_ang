import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UePageComponent } from './ue-page.component';

describe('UePageComponent', () => {
  let component: UePageComponent;
  let fixture: ComponentFixture<UePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
