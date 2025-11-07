import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HeaderComponent } from '@shared/header/header';
import { FooterComponent } from '@shared/footer/footer';
import { LoaderComponent } from '@shared/loader/loader';
import { User } from '@app/services/user';
import { HorarioPeliculaComponent } from '../horario-pelicula/horario-pelicula';
@Component({
  selector: 'cartelera',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    ButtonModule,
    HeaderComponent,
    FooterComponent,
    ProgressSpinnerModule,
    LoaderComponent,
    HorarioPeliculaComponent
  ],
  templateUrl: './cartelera.html',
  styleUrls: ['./cartelera.scss'],
})
export class Cartelera implements OnInit {
  peliculasEnCartelera: any[] = [];
  peliculasProximas: any[] = [];
  cargando = true;

  mostrarModalHorarios = false;
  peliculaSeleccionada: any = null;

  private categoriasMap = new Map<number, string>();

  opcionesResponsivas = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
    { breakpoint: '768px', numVisible: 2, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 },
  ];

  @ViewChild(HorarioPeliculaComponent)
  modalHorarios!: HorarioPeliculaComponent;

  constructor(
    private userService: User,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando = true;
    try {
      const [peliculas, categorias] = await Promise.all([
        this.userService.getPeliculas(),
        this.userService.getCategorias()
      ]);

      categorias.forEach((c: any) => this.categoriasMap.set(c.id, c.nombre));

      const procesadas = peliculas.map((p: any) => {
        const catId = p.categorias?.[0];
        const catNombre = this.categoriasMap.get(catId) || 'General';
        return { ...p, categoriaNombre: catNombre.toUpperCase() };
      });

      this.peliculasEnCartelera = procesadas.filter((p: any) => p.estado === 'cartelera');
      this.peliculasProximas = procesadas.filter(
        (p: any) => ['proximamente', 'estreno'].includes(p.estado)
      );
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      this.cargando = false;
    }
  }

  verDetalle(pelicula: any) {
    this.router.navigate(['/pelicula', pelicula.idpelicula]);
  }

  // ✅ Nuevo: abrir modal de horarios desde el botón
  abrirHorarios(pelicula: any) {
    this.peliculaSeleccionada = pelicula;
    this.mostrarModalHorarios = true;
    setTimeout(() => this.modalHorarios.abrirModal(pelicula), 50);
  }
}
