import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageUeComponent } from './page-ue.component';

describe('PageUeComponent', () => {
  let component: PageUeComponent;
  let fixture: ComponentFixture<PageUeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageUeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageUeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
