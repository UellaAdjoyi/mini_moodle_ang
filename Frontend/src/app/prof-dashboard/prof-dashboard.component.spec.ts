import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfDashboardComponent } from './prof-dashboard.component';

describe('ProfDashboardComponent', () => {
  let component: ProfDashboardComponent;
  let fixture: ComponentFixture<ProfDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
