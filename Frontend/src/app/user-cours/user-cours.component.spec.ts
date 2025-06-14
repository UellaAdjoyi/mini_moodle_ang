import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCoursComponent } from './user-cours.component';

describe('UserCoursComponent', () => {
  let component: UserCoursComponent;
  let fixture: ComponentFixture<UserCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
