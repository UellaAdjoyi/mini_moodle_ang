import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumDisplayComponent } from './forum-display.component';

describe('ForumDisplayComponent', () => {
  let component: ForumDisplayComponent;
  let fixture: ComponentFixture<ForumDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
