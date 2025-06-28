import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPostEtuComponent } from './list-post-etu.component';

describe('ListPostEtuComponent', () => {
  let component: ListPostEtuComponent;
  let fixture: ComponentFixture<ListPostEtuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPostEtuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPostEtuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
