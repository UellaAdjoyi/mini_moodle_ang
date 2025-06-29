import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDevoirComponent } from './show-devoir.component';

describe('ShowDevoirComponent', () => {
  let component: ShowDevoirComponent;
  let fixture: ComponentFixture<ShowDevoirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowDevoirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowDevoirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
