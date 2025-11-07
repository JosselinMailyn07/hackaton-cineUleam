import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioPelicula } from './horario-pelicula';

describe('HorarioPelicula', () => {
  let component: HorarioPelicula;
  let fixture: ComponentFixture<HorarioPelicula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioPelicula]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioPelicula);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
