import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantPostComponent } from './etudiant-post.component';

describe('EtudiantPostComponent', () => {
  let component: EtudiantPostComponent;
  let fixture: ComponentFixture<EtudiantPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtudiantPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtudiantPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
