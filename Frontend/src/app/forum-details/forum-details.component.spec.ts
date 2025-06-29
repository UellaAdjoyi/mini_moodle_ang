import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumDetailsComponent } from './forum-details.component';

describe('ForumDetailsComponent', () => {
  let component: ForumDetailsComponent;
  let fixture: ComponentFixture<ForumDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
