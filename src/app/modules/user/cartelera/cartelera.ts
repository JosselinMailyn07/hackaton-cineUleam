import { Component, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HeaderComponent } from '@shared/header/header';
import { FooterComponent } from '@shared/footer/footer';
import { LoaderComponent } from '@shared/loader/loader';
import { HorarioPelicula } from '../horario-pelicula/horario-pelicula';
import { User } from '@app/services/user';

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
    HorarioPelicula
  ],
  templateUrl: './cartelera.html',
  styleUrls: ['./cartelera.scss'],
})
export class Cartelera implements OnInit {
  
  peliculasEnCartelera: any[] = [];
  peliculasProximas: any[] = [];
  
  cargando: boolean = true;
  mostrarModalHorarios: boolean = false;
  peliculaSeleccionada: any = null;
  private categoriasMap = new Map<number, string>();

  opcionesResponsivas = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    }
  ];

  constructor(
    // 2. INYECTAR 'User'
    private userService: User
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando = true;
    try {
      // 3. LLAMAR A 'userService' PARA AMBAS CONSULTAS
      const [allMovies, allCategorias] = await Promise.all([
        this.userService.getPeliculas(),
        this.userService.getCategorias() // Usando el método de tu servicio
      ]);

      // 4. Crea el Mapa de categorías (ej: 1 -> 'Acción')
      allCategorias.forEach((cat: any) => {
        this.categoriasMap.set(cat.id, cat.nombre);
      });

      // 5. Procesa las películas para añadir el nombre de la categoría
      const processedMovies = allMovies.map((pelicula: any) => {
        let categoriaNombre = 'General'; // Default
        if (pelicula.categorias && pelicula.categorias.length > 0) {
          const primerCatId = pelicula.categorias[0];
          categoriaNombre = this.categoriasMap.get(primerCatId) || 'General';
        }
        return {
          ...pelicula,
          categoriaNombre: categoriaNombre.toUpperCase()
        };
      });

      // 6. Filtra las películas procesadas
      this.peliculasEnCartelera = processedMovies.filter(
        (p: any) => p.estado === 'cartelera'
      );
      
      this.peliculasProximas = processedMovies.filter(
        (p: any) => p.estado === 'proximamente' || p.estado === 'estreno'
      );

      console.log('En cartelera:', this.peliculasEnCartelera);
      console.log('Próximas:', this.peliculasProximas);

    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      this.cargando = false;
    }
  }

  /**
   * Abre el modal de horarios para la película seleccionada
   */
  verDetalle(pelicula: any) {
    this.peliculaSeleccionada = pelicula;
    this.mostrarModalHorarios = true;
  }
}