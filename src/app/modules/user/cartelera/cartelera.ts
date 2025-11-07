import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@shared/header/header';
import { FooterComponent } from '@shared/footer/footer';

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
  selector: 'cartelera',
  imports: [
    CommonModule,
    CarouselModule,
    ButtonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './cartelera.html',
  styleUrls: ['./cartelera.scss'],
})
export class Cartelera {
  peliculas: Pelicula[] = [
    {
      id: 1,
      titulo: 'Inside Out 2',
      imagen: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/2023/11/inside_out_two_xlg.jpg',
      categoria: 'ANIMACIÓN',
      etiqueta: 'ESTRENO',
      descripcion:
        'Las emociones regresan con nuevas aventuras dentro de la mente de Riley, explorando la adolescencia con humor y ternura.',
      textoBoton: 'Ver ahora'
    },
    {
      id: 2,
      titulo: 'Dune: Parte Dos',
      imagen: 'https://th.bing.com/th/id/R.1b2964e594bd3cb7461777e06072b7df?rik=vHZSBUNf4uqSKQ&riu=http%3a%2f%2fwww.beautifulballad.org%2fwp-content%2fuploads%2f2024%2f01%2fdune-part-two-DUNE2_VERT_MAIN_2764x4096_DOM_REV_rgb.jpg&ehk=r6NC4IY8%2bwPicTcNnRjRaP1peBAB3zfTEEEbcnP4rr8%3d&risl=&pid=ImgRaw&r=0',
      categoria: 'CIENCIA FICCIÓN',
      etiqueta: 'DESTACADA',
      descripcion:
        'Paul Atreides se une a los Fremen para vengar la conspiración que destruyó a su familia, enfrentando su destino en Arrakis.',
      textoBoton: 'Ver ahora'
    },
    {
      id: 3,
      titulo: 'Oppenheimer',
      imagen: 'https://tse3.mm.bing.net/th/id/OIP.MZQeJtP5IGINFpMyhMiZ7wHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
      categoria: 'DRAMA',
      etiqueta: 'ÉXITO',
      descripcion:
        'La historia de J. Robert Oppenheimer, el creador de la bomba atómica, y el dilema moral que cambió la historia del mundo.',
      textoBoton: 'Ver ahora'
    },
    {
      id: 4,
      titulo: 'Spider-Man: Across the Spider-Verse',
      imagen: 'https://tse1.mm.bing.net/th/id/OIP.UPzP54t5s9v9JIA0SULCcAHaK_?rs=1&pid=ImgDetMain&o=7&rm=3',
      categoria: 'SUPERHÉROES',
      etiqueta: 'POPULAR',
      descripcion:
        'Miles Morales se embarca en una nueva aventura multiversal junto a Gwen Stacy y un ejército de Spider-Personas.',
      textoBoton: 'Ver ahora'
    }
  ];
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
}
