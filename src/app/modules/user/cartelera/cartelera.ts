import { Component } from '@angular/core';

interface Pelicula {
  id: number;
  titulo: string;
  imagen: string;
  categoria: string;
  etiqueta: string;
  descripcion: string;
  textoBoton: string;
}
@Component({
  selector: 'app-cartelera',
  imports: [],
  templateUrl: './cartelera.html',
  styleUrl: './cartelera.scss',
})
export class Cartelera {
  peliculas: Pelicula[] = [
    {
      id: 1,
      titulo: 'Inside Out 2',
      imagen: 'assets/inside-out-2.jpg',
      categoria: 'ANIMACIÓN',
      etiqueta: 'ESTRENO',
      descripcion:
        'Las emociones regresan con nuevas aventuras dentro de la mente de Riley, explorando la adolescencia con humor y ternura.',
      textoBoton: 'Ver ahora'
    },
    {
      id: 2,
      titulo: 'Dune: Parte Dos',
      imagen: 'assets/dune-2.jpg',
      categoria: 'CIENCIA FICCIÓN',
      etiqueta: 'DESTACADA',
      descripcion:
        'Paul Atreides se une a los Fremen para vengar la conspiración que destruyó a su familia, enfrentando su destino en Arrakis.',
      textoBoton: 'Ver ahora'
    },
    {
      id: 3,
      titulo: 'Oppenheimer',
      imagen: 'assets/oppenheimer.jpg',
      categoria: 'DRAMA',
      etiqueta: 'ÉXITO',
      descripcion:
        'La historia de J. Robert Oppenheimer, el creador de la bomba atómica, y el dilema moral que cambió la historia del mundo.',
      textoBoton: 'Ver ahora'
    },
    {
      id: 4,
      titulo: 'Spider-Man: Across the Spider-Verse',
      imagen: 'assets/spiderverse.jpg',
      categoria: 'SUPERHÉROES',
      etiqueta: 'POPULAR',
      descripcion:
        'Miles Morales se embarca en una nueva aventura multiversal junto a Gwen Stacy y un ejército de Spider-Personas.',
      textoBoton: 'Ver ahora'
    }
  ];
}
