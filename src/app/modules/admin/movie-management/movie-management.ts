import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService, Footer } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '@shared/header/header';
import { FooterComponent } from '@shared/footer/footer';

// Interfaces para tipos de datos
interface Pelicula {
  id?: string;
  titulo: string;
  descripcion: string;
  duracion: number;
  genero: string[];
  clasificacion: string;
  director: string;
  actores: string[];
  fechaEstreno: Date;
  fechaFin: Date;
  imagenPortada: string;
  imagenBanner: string;
  trailerUrl: string;
  estado: 'activa' | 'inactiva' | 'proximamente';
  precio: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-movie-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule,
    FileUploadModule,
    TagModule,
    TooltipModule,
    ToastModule,
    HeaderComponent,
    FooterComponent
],
  providers: [MessageService, ConfirmationService, HeaderComponent,FooterComponent],
  templateUrl: './movie-management.html',
  styleUrls: ['./movie-management.scss']
})
export class MovieManagementComponent implements OnInit {
  
  // Lista de películas
  listaPeliculas: Pelicula[] = [];
  
  // Película seleccionada para edición
  peliculaSeleccionada: Pelicula = this.crearPeliculaVacia();
  
  // Estados del componente
  mostrarDialogoEdicion: boolean = false;
  esEdicion: boolean = false;
  cargando: boolean = true;
  submitted: boolean = false;

  // Opciones para dropdowns
  opcionesGeneros: any[] = [
    { label: 'Acción', value: 'accion' },
    { label: 'Aventura', value: 'aventura' },
    { label: 'Comedia', value: 'comedia' },
    { label: 'Drama', value: 'drama' },
    { label: 'Terror', value: 'terror' },
    { label: 'Ciencia Ficción', value: 'cienciaficcion' },
    { label: 'Romance', value: 'romance' },
    { label: 'Animación', value: 'animacion' },
    { label: 'Documental', value: 'documental' }
  ];

  opcionesClasificacion: any[] = [
    { label: 'A - Todo Público', value: 'A' },
    { label: 'B - 12+ años', value: 'B' },
    { label: 'B15 - 15+ años', value: 'B15' },
    { label: 'C - 18+ años', value: 'C' },
    { label: 'D - Películas Adultas', value: 'D' }
  ];

  opcionesEstados: any[] = [
    { label: 'Activa', value: 'activa' },
    { label: 'Inactiva', value: 'inactiva' },
    { label: 'Próximamente', value: 'proximamente' }
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // Simular carga de datos
    this.cargarPeliculas();
  }

  /**
   * Carga la lista de películas desde el servicio
   */
  cargarPeliculas() {
    this.cargando = true;
    
    // Simulación de datos - en producción vendrían de un servicio
    setTimeout(() => {
      this.listaPeliculas = [
        {
          id: '1',
          titulo: 'Avatar: The Way of Water',
          descripcion: 'Jake Sully y Neytiri han formado una familia...',
          duracion: 192,
          genero: ['aventura', 'ciencia-ficcion'],
          clasificacion: 'B',
          director: 'James Cameron',
          actores: ['Sam Worthington', 'Zoe Saldana'],
          fechaEstreno: new Date('2023-12-15'),
          fechaFin: new Date('2024-02-15'),
          imagenPortada: 'assets/peliculas/avatar.jpg',
          imagenBanner: 'assets/peliculas/avatar-banner.jpg',
          trailerUrl: 'https://youtube.com/avatar2',
          estado: 'activa',
          precio: 8.50
        },
        {
          id: '2',
          titulo: 'The Batman',
          descripcion: 'Batman explora la corrupción en Gotham City...',
          duracion: 176,
          genero: ['accion', 'drama'],
          clasificacion: 'B15',
          director: 'Matt Reeves',
          actores: ['Robert Pattinson', 'Zoë Kravitz'],
          fechaEstreno: new Date('2023-11-10'),
          fechaFin: new Date('2024-01-10'),
          imagenPortada: 'assets/peliculas/batman.jpg',
          imagenBanner: 'assets/peliculas/batman-banner.jpg',
          trailerUrl: 'https://youtube.com/batman',
          estado: 'activa',
          precio: 7.50
        },
        {
          id: '3',
          titulo: 'Spider-Man: No Way Home',
          descripcion: 'Peter Parker desenmascarado y no puede separar...',
          duracion: 148,
          genero: ['accion', 'aventura'],
          clasificacion: 'B',
          director: 'Jon Watts',
          actores: ['Tom Holland', 'Zendaya'],
          fechaEstreno: new Date('2023-12-17'),
          fechaFin: new Date('2024-02-17'),
          imagenPortada: 'assets/peliculas/spiderman.jpg',
          imagenBanner: 'assets/peliculas/spiderman-banner.jpg',
          trailerUrl: 'https://youtube.com/spiderman',
          estado: 'proximamente',
          precio: 8.00
        }
      ];
      this.cargando = false;
    }, 1000);
  }

  /**
   * Abre el diálogo para crear una nueva película
   */
  abrirDialogoNuevaPelicula() {
    this.peliculaSeleccionada = this.crearPeliculaVacia();
    this.esEdicion = false;
    this.mostrarDialogoEdicion = true;
    this.submitted = false;
  }

  /**
   * Abre el diálogo para editar una película existente
   */
  abrirDialogoEditarPelicula(pelicula: Pelicula) {
    this.peliculaSeleccionada = { ...pelicula };
    this.esEdicion = true;
    this.mostrarDialogoEdicion = true;
    this.submitted = false;
  }

  /**
   * Guarda la película (crear o actualizar)
   */
  guardarPelicula() {
    this.submitted = true;

    // Validación básica
    if (!this.validarPelicula()) {
      return;
    }

    // Simular guardado
    if (this.esEdicion) {
      // Actualizar película existente
      const index = this.listaPeliculas.findIndex(p => p.id === this.peliculaSeleccionada.id);
      if (index !== -1) {
        this.listaPeliculas[index] = { ...this.peliculaSeleccionada };
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Película actualizada correctamente'
      });
    } else {
      // Crear nueva película
      const nuevaPelicula = {
        ...this.peliculaSeleccionada,
        id: (this.listaPeliculas.length + 1).toString(),
        createdAt: new Date()
      };
      this.listaPeliculas.push(nuevaPelicula);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Película creada correctamente'
      });
    }

    this.mostrarDialogoEdicion = false;
    this.peliculaSeleccionada = this.crearPeliculaVacia();
  }

  /**
   * Valida los datos de la película
   */
  validarPelicula(): boolean {
    return !!this.peliculaSeleccionada.titulo &&
           !!this.peliculaSeleccionada.descripcion &&
           !!this.peliculaSeleccionada.director &&
           this.peliculaSeleccionada.genero.length > 0 &&
           !!this.peliculaSeleccionada.clasificacion &&
           !!this.peliculaSeleccionada.fechaEstreno;
  }

  /**
   * Confirma la eliminación de una película
   */
  confirmarEliminacion(pelicula: Pelicula) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar "${pelicula.titulo}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => this.eliminarPelicula(pelicula.id!)
    });
  }

  /**
   * Elimina una película
   */
  eliminarPelicula(id: string) {
    this.listaPeliculas = this.listaPeliculas.filter(p => p.id !== id);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Película eliminada correctamente'
    });
  }

  /**
   * Cambia el estado de una película
   */
  cambiarEstadoPelicula(pelicula: Pelicula) {
    const nuevoEstado = pelicula.estado === 'activa' ? 'inactiva' : 'activa';
    pelicula.estado = nuevoEstado;
    
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `Película ${nuevoEstado === 'activa' ? 'activada' : 'desactivada'}`
    });
  }

  /**
   * Crea una película vacía para formularios nuevos
   */
  crearPeliculaVacia(): Pelicula {
    return {
      titulo: '',
      descripcion: '',
      duracion: 0,
      genero: [],
      clasificacion: '',
      director: '',
      actores: [],
      fechaEstreno: new Date(),
      fechaFin: new Date(),
      imagenPortada: '',
      imagenBanner: '',
      trailerUrl: '',
      estado: 'activa',
      precio: 0
    };
  }

  /**
   * Obtiene la severidad para el tag de estado
   */
  obtenerSeveridadEstado(estado: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (estado) {
      case 'activa':
        return 'success';
      case 'inactiva':
        return 'danger';
      case 'proximamente':
        return 'warn';
      default:
        return 'info';
    }
  }

  /**
   * Formatea los géneros para mostrar
   */
  formatearGeneros(generos: string[]): string {
    return generos.map(gen => 
      this.opcionesGeneros.find(g => g.value === gen)?.label || gen
    ).join(', ');
  }

  /**
   * Maneja la subida de imágenes
   */
  onUploadImagen(event: any, tipo: 'portada' | 'banner') {
    // En producción, aquí se subiría al servidor
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (tipo === 'portada') {
          this.peliculaSeleccionada.imagenPortada = e.target.result;
        } else {
          this.peliculaSeleccionada.imagenBanner = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  /**
 * Cancela el formulario y cierra el diálogo
 */
cancelarFormulario() {
  this.mostrarDialogoEdicion = false;
  this.submitted = false;
  this.peliculaSeleccionada = this.crearPeliculaVacia();
  
  this.messageService.add({
    severity: 'info',
    summary: 'Cancelado',
    detail: 'Los cambios no fueron guardados',
    life: 3000
  });
}

/**
 * Guarda la película como borrador
 */
guardarBorrador() {
  if (!this.validarPelicula()) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Validación',
      detail: 'Complete los campos requeridos para guardar como borrador',
      life: 5000
    });
    return;
  }

  // Simular guardado como borrador
  const peliculaBorrador:Pelicula = {
    ...this.peliculaSeleccionada,
    estado: 'inactiva' // Los borradores se guardan como inactivos
  };

  if (this.esEdicion) {
    // Actualizar película existente como borrador
    const index = this.listaPeliculas.findIndex(p => p.id === peliculaBorrador.id);
    if (index !== -1) {
      this.listaPeliculas[index] = peliculaBorrador;
    }
  } else {
    // Crear nueva película como borrador
    const nuevaPelicula = {
      ...peliculaBorrador,
      id: (this.listaPeliculas.length + 1).toString(),
      createdAt: new Date()
    };
    this.listaPeliculas.push(nuevaPelicula);
  }

  this.mostrarDialogoEdicion = false;
  this.peliculaSeleccionada = this.crearPeliculaVacia();
  
  this.messageService.add({
    severity: 'success',
    summary: 'Borrador Guardado',
    detail: 'La película fue guardada como borrador',
    life: 5000
  });
}

/**
 * Maneja el cierre del diálogo
 */
onHideDialog() {
  this.submitted = false;
  this.peliculaSeleccionada = this.crearPeliculaVacia();
}
}